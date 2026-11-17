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
            'exercises' => [
                ['type' => 'multiple_choice', 'statement' => 'Qual função soma?', 'points' => 2, 'options' => [
                    ['text' => 'SOMA', 'correct' => true],
                    ['text' => 'MÉDIA', 'correct' => false],
                ]],
                ['type' => 'true_false', 'statement' => 'PROCV busca valores.', 'points' => 1, 'expected_answer' => 'true'],
                ['type' => 'essay', 'statement' => 'Explique o uso de SE.', 'points' => 3],
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
            'exercises' => [['type' => 'multiple_choice', 'statement' => 'X?', 'points' => 1, 'options' => [
                ['text' => 'A', 'correct' => false], ['text' => 'B', 'correct' => false],
            ]]],
        ]);

        $this->actingAs($this->admin)->post('/administrador/modulos', $payload)
            ->assertSessionHasErrors(['videos.0.category', 'videos.1.file', 'exercises.0.options']);

        $this->post('/administrador/modulos', $this->modulePayload(['videos' => []]))
            ->assertSessionHasErrors('videos');

        // Rascunho pode ser salvo sem vídeos.
        $this->post('/administrador/modulos', $this->modulePayload(['status' => 'draft', 'videos' => [], 'exercises' => []]))
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
            'exercises' => [
                ['type' => 'multiple_choice', 'statement' => 'Qual?', 'points' => 2, 'options' => [
                    ['text' => 'A', 'correct' => true], ['text' => 'B', 'correct' => false],
                ]],
                ['type' => 'essay', 'statement' => 'Explique.', 'points' => 5],
            ],
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertSame(2, $course->materials()->where('type', 'video')->count());
        $this->assertSame(2, $course->materials()->where('type', 'document')->count());
        $this->assertSame(['multiple_choice', 'essay'], $course->exercises->pluck('type')->all());

        // Exercícios inválidos são barrados também no curso livre.
        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Curso Livre Completo', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'free',
            'exercises' => [['type' => 'true_false', 'statement' => 'X', 'points' => 1]],
        ])->assertSessionHasErrors('exercises.0.expected_answer');

        // Ao virar curso modular, materiais e exercícios avulsos são removidos.
        $this->put("/administrador/cursos/{$course->id}", [
            'title' => 'Curso Livre Completo', 'level' => 'iniciante', 'status' => 'draft', 'structure' => 'modular',
        ])->assertSessionHasNoErrors();
        $this->assertSame(0, $course->exercises()->count());
        $this->assertSame(0, $course->materials()->count());
    }

    public function test_free_course_with_only_exercises_can_be_published(): void
    {
        $this->actingAs($this->admin)->post('/administrador/cursos', [
            'title' => 'Simulado', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'free',
            'exercises' => [['type' => 'short_answer', 'statement' => '2+2?', 'expected_answer' => '4', 'points' => 1]],
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
}
