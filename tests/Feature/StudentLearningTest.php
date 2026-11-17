<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\ExerciseAnswer;
use App\Models\User;
use App\Models\VideoNote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentLearningTest extends TestCase
{
    use RefreshDatabase;

    private User $student;
    private Course $course;
    private CourseModule $module;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create(['role' => 'student']);
        $this->course = Course::create(['title' => 'Excel', 'slug' => 'excel', 'status' => 'published', 'structure' => 'modular']);
        $this->module = CourseModule::create(['title' => 'Funções', 'application_minutes' => 10]);
        $this->course->modules()->attach($this->module->id, ['position' => 0]);
        Enrollment::create(['student_id' => $this->student->id, 'course_id' => $this->course->id, 'starts_at' => now()->subDay()]);
    }

    private function exercise(array $attrs)
    {
        return $this->module->exercises()->create(array_merge(['position' => 0, 'points' => 2], $attrs));
    }

    private function answer($exercise, $answer)
    {
        return $this->actingAs($this->student)->postJson("/student/cursos/excel/exercicios/{$exercise->id}/responder", ['answer' => $answer]);
    }

    public function test_multiple_choice_is_graded_and_stored(): void
    {
        $ex = $this->exercise(['type' => 'multiple_choice', 'statement' => 'Q', 'explanation' => 'Porque SOMA soma.', 'options' => [
            ['text' => 'SOMA', 'correct' => true], ['text' => 'MÉDIA', 'correct' => false], ['text' => 'TOTAL', 'correct' => true],
        ]]);

        $this->answer($ex, [0])->assertOk()->assertJson(['is_correct' => false, 'score' => '0.00', 'attempts' => 1]);
        $this->answer($ex, [2, 0])->assertOk()->assertJson(['is_correct' => true, 'score' => '2.00', 'attempts' => 2, 'explanation' => 'Porque SOMA soma.']);

        $stored = ExerciseAnswer::sole();
        $this->assertSame([0, 2], $stored->answer);
        $this->assertSame(2, $stored->attempts);
    }

    public function test_true_false_short_answer_and_essay(): void
    {
        $tf = $this->exercise(['type' => 'true_false', 'statement' => 'X', 'expected_answer' => 'false']);
        $this->answer($tf, 'false')->assertJson(['is_correct' => true]);

        $short = $this->exercise(['type' => 'short_answer', 'statement' => 'Função de soma?', 'expected_answer' => 'Soma']);
        $this->answer($short, '  soma ')->assertJson(['is_correct' => true]);
        $this->answer($short, 'média')->assertJson(['is_correct' => false]);

        $essay = $this->exercise(['type' => 'essay', 'statement' => 'Explique']);
        $this->answer($essay, 'Texto longo')->assertJson(['is_correct' => null, 'score' => null]);
        $this->assertSame('Texto longo', ExerciseAnswer::where('module_exercise_id', $essay->id)->first()->answer);
    }

    public function test_answer_validation_and_access_rules(): void
    {
        $ex = $this->exercise(['type' => 'multiple_choice', 'statement' => 'Q', 'options' => [['text' => 'A', 'correct' => true], ['text' => 'B', 'correct' => false]]]);

        $this->answer($ex, [])->assertUnprocessable()->assertJsonValidationErrors('answer');
        $this->answer($ex, [5])->assertUnprocessable();

        // Exercício de outro curso.
        $other = CourseModule::create(['title' => 'Outro', 'application_minutes' => 10]);
        $foreign = $other->exercises()->create(['position' => 0, 'type' => 'true_false', 'statement' => 'X', 'expected_answer' => 'true', 'points' => 1]);
        $this->answer($foreign, 'true')->assertNotFound();

        // Sem acesso ao curso.
        Enrollment::query()->update(['status' => 'canceled']);
        $this->answer($ex, [0])->assertForbidden();
    }

    public function test_saved_answers_come_back_without_the_answer_key(): void
    {
        $ex = $this->exercise(['type' => 'true_false', 'statement' => 'X', 'expected_answer' => 'true']);
        $this->answer($ex, 'false');

        $props = $this->get('/student/cursos/excel')->viewData('page')['props'];
        $saved = ((array) $props['answers'])[$ex->id];
        $this->assertSame('false', $saved['answer']);
        $this->assertFalse($saved['is_correct']);
        $this->assertArrayNotHasKey('expected_answer', $saved);
    }

    public function test_student_creates_edits_and_deletes_timestamped_notes(): void
    {
        $video = $this->module->materials()->create(['slot' => 'video', 'category' => 'Conceito', 'type' => 'video', 'title' => 'Aula', 'url' => 'https://youtu.be/abcdefgh']);

        $id = $this->actingAs($this->student)->postJson('/student/cursos/excel/notas', [
            'course_material_id' => $video->id, 'timestamp_seconds' => 135, 'body' => 'Revisar PROCV',
        ])->assertCreated()->assertJson(['timestamp_seconds' => 135])->json('id');

        $this->get('/student/cursos/excel')->assertInertia(fn ($page) => $page
            ->has('notes', 1)->where('notes.0.body', 'Revisar PROCV')->where('notes.0.timestamp_seconds', 135));

        $this->putJson("/student/notas/{$id}", ['body' => 'Revisar PROCV e SE'])->assertOk()->assertJson(['body' => 'Revisar PROCV e SE']);
        $this->deleteJson("/student/notas/{$id}")->assertOk();
        $this->assertSame(0, VideoNote::count());
    }

    public function test_notes_are_private_and_limited_to_course_videos(): void
    {
        $video = $this->module->materials()->create(['slot' => 'video', 'type' => 'video', 'title' => 'Aula', 'url' => 'https://youtu.be/abcdefgh']);
        $otherModule = CourseModule::create(['title' => 'Outro', 'application_minutes' => 10]);
        $foreignVideo = $otherModule->materials()->create(['slot' => 'video', 'type' => 'video', 'title' => 'X', 'url' => 'https://youtu.be/zzzzzzzz']);

        $this->actingAs($this->student)->postJson('/student/cursos/excel/notas', [
            'course_material_id' => $foreignVideo->id, 'timestamp_seconds' => 1, 'body' => 'x',
        ])->assertNotFound();

        $note = VideoNote::create(['student_id' => $this->student->id, 'course_id' => $this->course->id, 'course_material_id' => $video->id, 'timestamp_seconds' => 5, 'body' => 'minha']);
        $intruder = User::factory()->create(['role' => 'student']);
        $this->actingAs($intruder)->putJson("/student/notas/{$note->id}", ['body' => 'hack'])->assertNotFound();
        $this->actingAs($intruder)->deleteJson("/student/notas/{$note->id}")->assertNotFound();
    }
}
