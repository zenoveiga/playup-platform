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

    public function test_new_question_types_are_graded_with_partial_credit(): void
    {
        $single = $this->exercise(['type' => 'single_choice', 'statement' => 'Q', 'options' => [
            ['text' => 'A', 'correct' => false], ['text' => 'B', 'correct' => true],
        ]]);
        $this->answer($single, 0)->assertJson(['is_correct' => false]);
        $this->answer($single, 1)->assertJson(['is_correct' => true, 'score' => '2.00', 'max_score' => 2]);

        $statements = $this->exercise(['type' => 'statements', 'statement' => 'Julgue', 'points' => 4, 'options' => [
            ['text' => 'a', 'correct' => true], ['text' => 'b', 'correct' => false], ['text' => 'c', 'correct' => true], ['text' => 'd', 'correct' => false],
        ]]);
        $this->answer($statements, ['true', 'false', 'false', 'true'])->assertJson(['is_correct' => false, 'score' => '2.00']);
        $this->answer($statements, ['true', 'false'])->assertUnprocessable();

        $blanks = $this->exercise(['type' => 'fill_blanks', 'statement' => '[[SOMA]] soma e [[MÉDIA|media]] calcula a média.']);
        $this->answer($blanks, ['soma', 'Média'])->assertJson(['is_correct' => true, 'score' => '2.00']);
        $this->answer($blanks, ['soma', 'total'])->assertJson(['is_correct' => false, 'score' => '1.00']);

        $numeric = $this->exercise(['type' => 'numeric', 'statement' => '10/4', 'expected_answer' => '2.5', 'settings' => ['tolerance' => 0.05]]);
        $this->answer($numeric, '2,52')->assertJson(['is_correct' => true]);
        $this->answer($numeric, '2,6')->assertJson(['is_correct' => false]);
        $this->answer($numeric, 'abc')->assertUnprocessable();

        $short = $this->exercise(['type' => 'short_answer', 'statement' => 'Função?', 'expected_answer' => "SOMA\nSUM"]);
        $this->answer($short, 'sum')->assertJson(['is_correct' => true]);
    }

    public function test_matching_and_ordering_are_shuffled_for_the_student_and_graded(): void
    {
        $set = $this->module->exerciseSets()->create(['title' => 'Associações', 'position' => 0]);
        $matching = $this->exercise(['type' => 'matching', 'statement' => 'Associe', 'options' => [
            ['text' => 'SOMA', 'match' => 'Adiciona'], ['text' => 'MÉDIA', 'match' => 'Calcula a média'], ['text' => 'MÁXIMO', 'match' => 'Maior valor'],
        ]]);
        $matching->forceFill(['exercise_set_id' => $set->id])->save();
        $ordering = $this->exercise(['type' => 'ordering', 'statement' => 'Ordene', 'options' => [['text' => '1º'], ['text' => '2º'], ['text' => '3º']]]);
        $ordering->forceFill(['exercise_set_id' => $set->id, 'position' => 1])->save();

        $props = $this->actingAs($this->student)->get('/student/cursos/excel')->viewData('page')['props'];
        $studentSet = $props['course']['modules'][0]['exercise_sets'][0];
        $this->assertSame('Associações', $studentSet['title']);
        [$m, $o] = $studentSet['questions'];
        $this->assertSame(['SOMA', 'MÉDIA', 'MÁXIMO'], collect($m['left'])->all());
        $this->assertEqualsCanonicalizing(['Adiciona', 'Calcula a média', 'Maior valor'], collect($m['right'])->all());
        $this->assertNotSame(['1º', '2º', '3º'], collect($o['items'])->all());
        $this->assertArrayNotHasKey('options', $o);

        // Resposta correta: para cada item da coluna A, a posição exibida do seu par.
        $right = collect($m['right']);
        $correct = [$right->search('Adiciona'), $right->search('Calcula a média'), $right->search('Maior valor')];
        $this->answer($matching, $correct)->assertJson(['is_correct' => true, 'score' => '2.00']);
        $this->answer($matching, [$correct[1], $correct[0], $correct[2]])->assertJson(['is_correct' => false]);

        $items = collect($o['items']);
        $this->answer($ordering, [$items->search('1º'), $items->search('2º'), $items->search('3º')])->assertJson(['is_correct' => true]);
        $this->answer($ordering, [0, 1, 2])->assertJson(['is_correct' => false]);
        $this->answer($ordering, [0, 0, 1])->assertUnprocessable();
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
