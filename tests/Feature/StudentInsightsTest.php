<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\StudyDay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentInsightsTest extends TestCase
{
    use RefreshDatabase;

    private User $licensee;
    private User $student;
    private Course $course;
    private CourseModule $module;
    private int $videoId;
    private array $questionIds;

    protected function setUp(): void
    {
        parent::setUp();
        $this->licensee = User::factory()->create(['role' => 'school_admin']);
        $this->student = User::factory()->create(['role' => 'student', 'licensee_id' => $this->licensee->id]);
        $this->course = Course::create(['title' => 'Cuidador', 'slug' => 'cuidador', 'status' => 'published', 'structure' => 'modular']);
        $this->module = CourseModule::create(['title' => 'Fundamentos', 'application_minutes' => 10, 'application_instructions' => 'Pratique.']);
        $this->course->modules()->attach($this->module->id, ['position' => 0]);
        $this->videoId = $this->module->materials()->create(['slot' => 'video', 'category' => 'Conceito', 'type' => 'video', 'title' => 'Conceito', 'url' => 'https://vimeo.com/1', 'position' => 0])->id;

        $set = $this->module->exerciseSets()->create(['title' => 'Fixação', 'position' => 0]);
        $this->questionIds = collect([0, 1])->map(function ($i) use ($set) {
            $q = $this->module->exercises()->make(['position' => $i, 'type' => 'true_false', 'statement' => "Q$i", 'expected_answer' => 'true', 'points' => 2]);
            $q->exercise_set_id = $set->id;
            $q->save();

            return $q->id;
        })->all();
    }

    private function enroll(int $startedDaysAgo, ?int $days): void
    {
        Enrollment::create([
            'student_id' => $this->student->id,
            'course_id' => $this->course->id,
            'licensee_id' => $this->licensee->id,
            'starts_at' => now()->subDays($startedDaysAgo),
            'expires_at' => $days ? now()->subDays($startedDaysAgo)->addDays($days) : null,
        ]);
    }

    private function insights(): array
    {
        return $this->actingAs($this->licensee)->get("/school-admin/alunos/{$this->student->id}")
            ->assertOk()
            ->viewData('page')['props']['insights'];
    }

    public function test_student_who_never_accessed_and_is_running_out_of_time_is_at_risk(): void
    {
        $this->enroll(20, 30); // 2/3 do prazo já passou, nenhum progresso

        $i = $this->insights();
        $this->assertSame('risk', $i['status']['level']);
        $this->assertStringContainsString('Ainda não acessou', $i['status']['reasons'][0]);
        $this->assertSame(67, $i['courses'][0]['expected_percent']);
        $this->assertTrue($i['courses'][0]['will_miss']);
        $this->assertNull($i['overview']['days_since_access']);
        $this->assertCount(30, $i['daily']);
    }

    public function test_active_student_shows_study_time_pace_and_report_card(): void
    {
        $this->enroll(1, 60);

        $this->actingAs($this->student)->postJson('/student/cursos/cuidador/progresso', ['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'open' => true]);
        $this->travel(2)->minutes();
        $this->postJson('/student/cursos/cuidador/progresso', ['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'seconds' => 90, 'watched' => 90, 'duration' => 100])
            ->assertJson(['completed' => true]);
        $this->postJson("/student/cursos/cuidador/exercicios/{$this->questionIds[0]}/responder", ['answer' => 'false']);
        $this->postJson("/student/cursos/cuidador/exercicios/{$this->questionIds[0]}/responder", ['answer' => 'true']);

        $this->assertSame(90, StudyDay::sole()->seconds);

        $i = $this->insights();
        $this->assertSame('engaged', $i['status']['level']);
        $this->assertSame(90, $i['overview']['time_7d']);
        $this->assertSame(0, $i['overview']['days_since_access']);
        $this->assertSame(1, $i['overview']['active_days_30d']);
        $this->assertSame(1, $i['overview']['streak']);
        $this->assertSame(100, $i['overview']['score_pct']);
        $this->assertSame(90, $i['overview']['videos_watched_pct']);

        $course = $i['courses'][0];
        $this->assertSame(1, $course['completed']); // vídeo
        $this->assertSame(3, $course['total']);
        $this->assertNotNull($course['projected_end']);

        $row = $course['report']['rows'][0];
        $this->assertSame('Fixação', $row['title']);
        $this->assertSame(1, $row['answered']);
        $this->assertSame(2, $row['questions']);
        $this->assertEquals(2, $row['score']);
        $this->assertSame(4, $row['max_score']);
        $this->assertEquals(2, $row['attempts']);
    }

    public function test_long_absence_puts_student_in_attention_then_risk(): void
    {
        $this->enroll(40, null); // acesso vitalício: sem ritmo esperado
        $this->actingAs($this->student)->postJson('/student/cursos/cuidador/progresso', ['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'open' => true]);

        $this->travel(9)->days();
        $this->assertSame('attention', $this->insights()['status']['level']);

        $this->travel(7)->days();
        $i = $this->insights();
        $this->assertSame('risk', $i['status']['level']);
        $this->assertSame('16 dias sem acessar', $i['status']['reasons'][0]);
        $this->assertNull($i['courses'][0]['expected_percent']);
    }
}
