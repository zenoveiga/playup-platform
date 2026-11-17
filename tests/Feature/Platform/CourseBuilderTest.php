<?php

namespace Tests\Feature\Platform;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CourseBuilderTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake(config('playup.media.disk'));
        $this->admin = User::factory()->create(['role' => 'super_admin']);
    }

    private function modulePayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Funções no Excel',
            'description' => 'Introdução às funções',
            'application_minutes' => 10,
            'application_instructions' => 'Monte uma planilha com SOMA e MÉDIA.',
            'status' => 'published',
            'videos' => [
                ['category' => 'Conceito', 'source' => 'upload', 'file' => UploadedFile::fake()->create('conceito.mp4', 1000, 'video/mp4'), 'duration_minutes' => 6],
                ['category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/123'],
                ['category' => 'Erros comuns', 'source' => 'upload', 'file' => UploadedFile::fake()->create('erros.mp4', 1000, 'video/mp4')],
            ],
            'support' => [
                ['type' => 'document', 'title' => 'Apostila', 'file' => UploadedFile::fake()->create('apostila.pdf', 200, 'application/pdf')],
                ['type' => 'link', 'title' => 'Documentação', 'url' => 'https://support.microsoft.com'],
            ],
            'exercise_sets' => [
                ['title' => 'Fixação', 'description' => 'Responda após o vídeo conceito.', 'questions' => [
                    ['type' => 'multiple_choice', 'statement' => 'Qual função soma?', 'points' => 2, 'options' => [
                        ['text' => 'SOMA', 'correct' => true],
                        ['text' => 'MÉDIA', 'correct' => false],
                    ]],
                    ['type' => 'true_false', 'statement' => 'PROCV busca valores.', 'points' => 1, 'expected_answer' => 'true'],
                ]],
                ['title' => 'Desafio', 'questions' => [
                    ['type' => 'essay', 'statement' => 'Explique o uso de SE.', 'points' => 3],
                ]],
            ],
        ], $overrides);
    }

    public function test_admin_creates_a_complete_module(): void
    {
        $this->actingAs($this->admin)
            ->post('/administrador/modulos', $this->modulePayload())
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $module = CourseModule::first();
        $this->assertSame(3, $module->videos()->count());
        $this->assertSame(2, $module->supportMaterials()->count());
        $this->assertSame(3, $module->exercises()->count());
        $this->assertSame(['Fixação', 'Desafio'], $module->exerciseSets()->pluck('title')->all());
        $this->assertSame(2, $module->exerciseSets[0]->questions()->count());
        $this->assertSame([['text' => 'SOMA', 'correct' => true], ['text' => 'MÉDIA', 'correct' => false]], $module->exercises[0]->options);

        $this->assertSame(['Conceito', 'Exemplo', 'Erros comuns'], $module->videos()->pluck('category')->all());
        $this->assertSame('Conceito', $module->videos()->first()->title);

        $concept = $module->videos()->where('category', 'Conceito')->first();
        Storage::disk(config('playup.media.disk'))->assertExists($concept->file_path);
    }

    public function test_videos_are_a_free_list_with_custom_categories(): void
    {
        $this->actingAs($this->admin)->post('/administrador/modulos', $this->modulePayload([
            'videos' => [
                ['category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/1'],
                ['category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/2', 'title' => 'Exemplo avançado'],
                ['category' => 'Bastidores', 'source' => 'url', 'url' => 'https://vimeo.com/3'],
            ],
        ]))->assertSessionHasNoErrors();

        $videos = CourseModule::first()->videos;
        $this->assertSame(['Exemplo', 'Exemplo', 'Bastidores'], $videos->pluck('category')->all());
        $this->assertSame('Exemplo avançado', $videos[1]->title);

        // Categoria nova passa a ser sugerida nos próximos módulos.
        $this->get('/administrador/modulos/novo')->assertInertia(
            fn ($page) => $page->where('videoCategories', fn ($c) => collect($c)->contains('Bastidores'))
        );
    }

    public function test_publishing_requires_a_video_and_each_video_needs_category_and_content(): void
    {
        $payload = $this->modulePayload([
            'videos' => [
                ['source' => 'url', 'url' => 'https://vimeo.com/1'],
                ['category' => 'Conceito', 'source' => 'upload'],
            ],
            'exercise_sets' => [['title' => '', 'questions' => [['type' => 'multiple_choice', 'statement' => 'X?', 'points' => 1, 'options' => [
                ['text' => 'A', 'correct' => false], ['text' => 'B', 'correct' => false],
            ]]]]],
        ]);

        $this->actingAs($this->admin)->post('/administrador/modulos', $payload)
            ->assertSessionHasErrors(['videos.0.category', 'videos.1.file', 'exercise_sets.0.title', 'exercise_sets.0.questions.0.options']);

        $this->post('/administrador/modulos', $this->modulePayload(['videos' => []]))
            ->assertSessionHasErrors('videos');

        // Rascunho pode ser salvo sem vídeos.
        $this->post('/administrador/modulos', $this->modulePayload(['status' => 'draft', 'videos' => [], 'exercise_sets' => []]))
            ->assertSessionHasNoErrors();
    }

    public function test_updating_a_module_keeps_existing_files_and_removes_dropped_materials(): void
    {
        $this->actingAs($this->admin)->post('/administrador/modulos', $this->modulePayload());
        $module = CourseModule::first();
        $videos = $module->videos()->get()->keyBy('category');
        $apostila = $module->supportMaterials()->where('type', 'document')->first();

        $this->put("/administrador/modulos/{$module->id}", $this->modulePayload([
            'videos' => [
                ['id' => $videos['Exemplo']->id, 'category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/999'],
                ['id' => $videos['Conceito']->id, 'category' => 'Conceito', 'source' => 'upload'],
            ],
            'support' => [],
        ]))->assertSessionHasNoErrors();

        $this->assertSame($videos['Conceito']->file_path, $videos['Conceito']->fresh()->file_path);
        $this->assertSame('https://vimeo.com/999', $videos['Exemplo']->fresh()->url);
        // Reordenado e vídeo removido apagado do armazenamento.
        $this->assertSame(['Exemplo', 'Conceito'], $module->videos()->pluck('category')->all());
        $this->assertNull($videos['Erros comuns']->fresh());
        Storage::disk(config('playup.media.disk'))->assertMissing($videos['Erros comuns']->file_path);
        $this->assertSame(0, $module->supportMaterials()->count());
        Storage::disk(config('playup.media.disk'))->assertMissing($apostila->file_path);
    }

    public function test_admin_builds_a_modular_course_from_ordered_modules(): void
    {
        $a = CourseModule::create(['title' => 'A', 'application_minutes' => 10]);
        $b = CourseModule::create(['title' => 'B', 'application_minutes' => 10]);

        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Excel Completo',
            'level' => 'iniciante',
            'status' => 'published',
            'structure' => 'modular',
            'module_ids' => [$b->id, $a->id],
            'cover' => UploadedFile::fake()->image('capa.jpg'),
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertSame('excel-completo', $course->slug);
        $this->assertSame([$b->id, $a->id], $course->modules->pluck('id')->all());
        Storage::disk(config('playup.media.disk'))->assertExists($course->cover_path);
    }

    public function test_admin_builds_a_free_course_without_modules(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Workshop Rápido',
            'level' => 'iniciante',
            'status' => 'published',
            'structure' => 'free',
            'materials' => [
                ['type' => 'video', 'title' => 'Aula 1', 'source' => 'url', 'url' => 'https://youtube.com/watch?v=1'],
                ['type' => 'document', 'title' => 'Apostila', 'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf')],
                ['type' => 'link', 'title' => 'Referência', 'url' => 'https://playup.com'],
            ],
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertSame(['Aula 1', 'Apostila', 'Referência'], $course->materials->pluck('title')->all());
        $this->assertSame(0, $course->modules()->count());
    }

    public function test_free_course_accepts_many_videos_handouts_and_exercises(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Curso Livre Completo',
            'level' => 'iniciante',
            'status' => 'published',
            'structure' => 'free',
            'materials' => [
                ['type' => 'video', 'title' => 'Aula 1', 'source' => 'upload', 'file' => UploadedFile::fake()->create('a1.mp4', 500, 'video/mp4')],
                ['type' => 'video', 'title' => 'Aula 2', 'source' => 'url', 'url' => 'https://vimeo.com/2'],
                ['type' => 'document', 'title' => 'Apostila 1', 'file' => UploadedFile::fake()->create('ap1.pdf', 100, 'application/pdf')],
                ['type' => 'document', 'title' => 'Apostila 2', 'file' => UploadedFile::fake()->create('ap2.pdf', 100, 'application/pdf')],
            ],
            'exercise_sets' => [
                ['title' => 'Lista 1', 'questions' => [['type' => 'multiple_choice', 'statement' => 'Qual?', 'points' => 2, 'options' => [
                    ['text' => 'A', 'correct' => true], ['text' => 'B', 'correct' => false],
                ]]]],
                ['title' => 'Lista 2', 'questions' => [['type' => 'essay', 'statement' => 'Explique.', 'points' => 5]]],
            ],
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertSame(2, $course->materials()->where('type', 'video')->count());
        $this->assertSame(2, $course->materials()->where('type', 'document')->count());
        $this->assertSame(['multiple_choice', 'essay'], $course->exercises->pluck('type')->all());

        // Exercícios inválidos são barrados também no curso livre.
        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Curso Livre Completo', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'free',
            'exercise_sets' => [['title' => 'L', 'questions' => [['type' => 'true_false', 'statement' => 'X', 'points' => 1]]]],
        ])->assertSessionHasErrors('exercise_sets.0.questions.0.expected_answer');

        // Ao virar curso modular, materiais e exercícios avulsos são removidos.
        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Curso Livre Completo', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'modular',
        ])->assertSessionHasNoErrors();
        $this->assertSame(0, $course->exercises()->count());
        $this->assertSame(0, $course->exerciseSets()->count());
        $this->assertSame(0, $course->materials()->count());
    }

    public function test_free_course_with_only_exercises_can_be_published(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Simulado', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'free',
            'exercise_sets' => [['title' => 'Simulado 1', 'questions' => [['type' => 'short_answer', 'statement' => '2+2?', 'expected_answer' => '4', 'points' => 1]]]],
        ])->assertSessionHasNoErrors();

        $this->assertSame(1, Course::first()->exercises()->count());
    }

    public function test_admin_sets_the_suggested_price_on_the_course_form(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Com preço', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'modular',
            'suggested_price' => '397.90',
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertSame('397.90', \App\Models\PriceTable::suggested()->priceMap()[$course->id]);

        $this->get("/administrador/cursos/{$course->id}/editar")
            ->assertInertia(fn ($page) => $page->where('course.suggested_price', '397.90'));
        $this->get('/administrador/cursos')
            ->assertInertia(fn ($page) => $page->where("suggestedPrices.{$course->id}", '397.90'));

        // Limpar o campo remove o valor sugerido.
        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Com preço', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'modular',
            'suggested_price' => '',
        ])->assertSessionHasNoErrors();
        $this->assertArrayNotHasKey($course->id, \App\Models\PriceTable::suggested()->priceMap());

        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Com preço', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'modular',
            'suggested_price' => '-5',
        ])->assertSessionHasErrors('suggested_price');
    }

    public function test_publishing_an_empty_course_is_rejected(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Vazio', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'modular',
        ])->assertSessionHasErrors('module_ids');

        $this->post('/administrador/cursos', [
            'title' => 'Vazio', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'free',
        ])->assertSessionHasErrors('materials');
    }

    public function test_licensees_cannot_manage_the_catalog(): void
    {
        $licensee = User::factory()->create(['role' => 'admin']);

        $this->actingAs($licensee)->get('/administrador/cursos')->assertForbidden();
        $this->actingAs($licensee)->post('/administrador/modulos', [])->assertForbidden();
    }

    public function test_editing_exercises_keeps_ids_and_validates_new_question_types(): void
    {
        $this->actingAs($this->admin)->post('/administrador/modulos', $this->modulePayload())->assertSessionHasNoErrors();
        $module = CourseModule::first();
        $set = $module->exerciseSets()->first();
        $question = $set->questions()->first();

        $payload = $this->modulePayload([
            'videos' => [['category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/123']],
            'exercise_sets' => [
                ['id' => $set->id, 'title' => 'Fixação (revisado)', 'questions' => [
                    ['id' => $question->id, 'type' => 'single_choice', 'statement' => 'Qual função soma?', 'points' => 2, 'options' => [
                        ['text' => 'SOMA', 'correct' => true], ['text' => 'MÉDIA', 'correct' => false],
                    ]],
                    ['type' => 'statements', 'statement' => 'Julgue', 'points' => 2, 'options' => [
                        ['text' => 'SOMA soma', 'correct' => true], ['text' => 'MÉDIA soma', 'correct' => false],
                    ]],
                    ['type' => 'fill_blanks', 'statement' => 'A função [[SOMA]] soma.', 'points' => 1],
                    ['type' => 'matching', 'statement' => 'Associe', 'points' => 2, 'options' => [
                        ['text' => 'SOMA', 'match' => 'Adiciona'], ['text' => 'MÉDIA', 'match' => 'Média'],
                    ]],
                    ['type' => 'ordering', 'statement' => 'Ordene', 'points' => 1, 'options' => [['text' => '1'], ['text' => '2']]],
                    ['type' => 'numeric', 'statement' => '10/4?', 'points' => 1, 'expected_answer' => '2,5', 'tolerance' => '0.01'],
                ]],
            ],
        ]);

        $this->put("/administrador/modulos/{$module->id}", $payload)->assertSessionHasNoErrors();

        $module->refresh();
        $this->assertSame([$set->id], $module->exerciseSets()->pluck('id')->all());
        $this->assertSame('Fixação (revisado)', $set->fresh()->title);
        $this->assertSame('single_choice', $question->fresh()->type); // mesma questão, atualizada
        $this->assertSame(6, $module->exercises()->count());
        $this->assertSame(['tolerance' => 0.01], $module->exercises()->where('type', 'numeric')->first()->settings);
        $this->assertSame([['text' => 'SOMA', 'match' => 'Adiciona'], ['text' => 'MÉDIA', 'match' => 'Média']], $module->exercises()->where('type', 'matching')->first()->options);

        // Regras específicas de cada tipo.
        $invalid = $this->modulePayload([
            'videos' => [['category' => 'Exemplo', 'source' => 'url', 'url' => 'https://vimeo.com/123']],
            'exercise_sets' => [
                ['title' => 'Inválido', 'questions' => [
                    ['type' => 'single_choice', 'statement' => 'X', 'points' => 1, 'options' => [['text' => 'A', 'correct' => true], ['text' => 'B', 'correct' => true]]],
                    ['type' => 'fill_blanks', 'statement' => 'Sem lacuna', 'points' => 1],
                    ['type' => 'matching', 'statement' => 'X', 'points' => 1, 'options' => [['text' => 'A', 'match' => 'a'], ['text' => 'B', 'match' => '']]],
                    ['type' => 'numeric', 'statement' => 'X', 'points' => 1, 'expected_answer' => 'abc'],
                ]],
                ['title' => 'Vazio', 'questions' => []],
            ],
        ]);
        $this->put("/administrador/modulos/{$module->id}", $invalid)->assertSessionHasErrors([
            'exercise_sets.0.questions.0.options',
            'exercise_sets.0.questions.1.statement',
            'exercise_sets.0.questions.2.options',
            'exercise_sets.0.questions.3.expected_answer',
            'exercise_sets.1.questions',
        ]);
    }

    public function test_admin_defines_the_lesson_order_with_exercises_before_videos(): void
    {
        $this->actingAs($this->admin)
            ->post('/administrador/modulos', $this->modulePayload(['outline' => ['set:1', 'video:2', 'application', 'video:0', 'support', 'video:9']]))
            ->assertSessionHasNoErrors();

        $module = CourseModule::first();
        $videos = $module->videos()->reorder('position')->pluck('id');
        $sets = $module->exerciseSets()->pluck('id');
        // Índices viram ids; índice inexistente (video:9) é descartado.
        $this->assertSame(["set:{$sets[1]}", "video:{$videos[2]}", 'application', "video:{$videos[0]}", 'support'], $module->outline);

        // Token inválido é rejeitado.
        $this->post('/administrador/modulos', $this->modulePayload(['outline' => ['qualquer:1']]))->assertSessionHasErrors('outline.0');

        // Curso livre: exercício antes da apostila.
        $this->post('/administrador/cursos', [
            'title' => 'Livre', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'free',
            'materials' => [['type' => 'link', 'title' => 'Leitura', 'url' => 'https://example.com']],
            'exercise_sets' => [['title' => 'Diagnóstico', 'questions' => [['type' => 'essay', 'statement' => 'X', 'points' => 1]]]],
            'outline' => ['set:0', 'material:0'],
        ])->assertSessionHasNoErrors();
        $course = Course::where('title', 'Livre')->first();
        $this->assertSame(['set:'.$course->exerciseSets()->value('id'), 'material:'.$course->materials()->value('id')], $course->outline);
    }
}
