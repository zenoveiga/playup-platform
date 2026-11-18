<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseProgressTest extends TestCase
{
    use RefreshDatabase;

    private User $licensee;
    private User $student;
    private Course $course;
    private CourseModule $module;
    private int $videoId;
    private int $setId;
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
        $this->setId = $set->id;
        $this->questionIds = collect([0, 1])->map(function ($i) use ($set) {
            $q = $this->module->exercises()->make(['position' => $i, 'type' => 'true_false', 'statement' => "Q$i", 'expected_answer' => 'true', 'points' => 1]);
            $q->exercise_set_id = $set->id;
            $q->save();

            return $q->id;
        })->all();

        Enrollment::create(['student_id' => $this->student->id, 'course_id' => $this->course->id, 'licensee_id' => $this->licensee->id, 'starts_at' => now()->subDay()]);
    }

    private function track(array $payload)
    {
        return $this->actingAs($this->student)->postJson('/student/cursos/cuidador/progresso', $payload);
    }

    public function test_video_time_and_watching_are_recorded_and_complete_at_85_percent(): void
    {
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'open' => true])->assertOk()->assertJson(['completed' => false]);

        // Envio inflado logo em seguida é limitado ao tempo real decorrido.
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'seconds' => 120, 'watched' => 120, 'duration' => 100]);
        $row = LessonProgress::sole();
        $this->assertSame(1, $row->views);
        $this->assertLessThanOrEqual(5, $row->time_spent_seconds);

        $this->travel(1)->minutes();
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'seconds' => 60, 'watched' => 40, 'duration' => 100, 'position' => 50])
            ->assertJson(['completed' => false]);

        $this->travel(1)->minutes();
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'seconds' => 60, 'watched' => 50, 'duration' => 100, 'position' => 95])
            ->assertJson(['completed' => true]);

        $row->refresh();
        $this->assertSame(100, $row->duration_seconds);
        $this->assertSame(95, $row->last_position_seconds);
        $this->assertGreaterThanOrEqual(120, $row->time_spent_seconds);
    }

    public function test_course_progress_counts_videos_application_and_exercises(): void
    {
        // 3 aulas: vídeo, aplicação, exercício.
        $this->track(['lesson_type' => 'application', 'lesson_id' => $this->module->id, 'complete' => true])->assertJson(['completed' => true]);

        $this->actingAs($this->student)->get('/student/cursos')
            ->assertInertia(fn ($page) => $page->where('myCourses.0.progress.percent', 33)->where('myCourses.0.progress.total', 3));

        foreach ($this->questionIds as $id) {
            $this->postJson("/student/cursos/cuidador/exercicios/{$id}/responder", ['answer' => 'true'])->assertOk();
        }

        $this->get('/student/cursos/cuidador')
            ->assertInertia(fn ($page) => $page
                ->where('progress.percent', 66)
                ->where("progress.lessons.exercise_set:{$this->setId}.completed", true)
                ->where("progress.lessons.application:{$this->module->id}.completed", true));

        // Material de apoio conta como engajamento, mas não entra na porcentagem.
        $doc = $this->module->materials()->create(['slot' => 'support', 'type' => 'link', 'title' => 'Leitura', 'url' => 'https://example.com', 'position' => 1]);
        $this->track(['lesson_type' => 'material', 'lesson_id' => $doc->id, 'open' => true])->assertOk();
        $this->get('/student/cursos')->assertInertia(fn ($page) => $page->where('myCourses.0.progress.percent', 66));
    }

    public function test_tracking_rejects_lessons_from_other_courses_and_students_without_access(): void
    {
        $other = CourseModule::create(['title' => 'Outro', 'application_minutes' => 5]);
        $foreignVideo = $other->materials()->create(['slot' => 'video', 'type' => 'video', 'title' => 'X', 'url' => 'https://vimeo.com/2', 'position' => 0]);

        $this->track(['lesson_type' => 'video', 'lesson_id' => $foreignVideo->id, 'open' => true])->assertNotFound();
        $this->track(['lesson_type' => 'application', 'lesson_id' => $other->id, 'complete' => true])->assertNotFound();
        $this->track(['lesson_type' => 'qualquer', 'lesson_id' => 1])->assertUnprocessable();

        Enrollment::query()->update(['status' => 'canceled']);
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'open' => true])->assertForbidden();
        $this->assertSame(0, LessonProgress::count());
    }

    public function test_licensee_sees_engagement_of_their_students_only(): void
    {
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'open' => true]);
        $this->travel(1)->minutes();
        $this->track(['lesson_type' => 'video', 'lesson_id' => $this->videoId, 'seconds' => 50, 'watched' => 30, 'duration' => 60]);

        $this->actingAs($this->licensee)->get('/school-admin/engajamento')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Licensee/Engagement/Index')
                ->where('courses.0.title', 'Cuidador')
                ->where('courses.0.students', 1)
                ->where('selected.students.0.name', $this->student->name)
                ->where('selected.lessons.0.type', 'video')
                ->where('selected.lessons.0.viewers', 1)
                ->where('selected.lessons.0.avg_watched_pct', 50));

        $this->get("/school-admin/engajamento/{$this->course->id}/alunos/{$this->student->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Licensee/Engagement/Student')
                ->where('lessons.0.watched_pct', 50)
                ->where('summary.total', 3));

        // Outro licenciado não vê este aluno.
        $intruder = User::factory()->create(['role' => 'school_admin']);
        $this->actingAs($intruder)->get('/school-admin/engajamento')->assertInertia(fn ($page) => $page->where('courses', []));
        $this->get("/school-admin/engajamento/{$this->course->id}/alunos/{$this->student->id}")->assertNotFound();
    }
}
