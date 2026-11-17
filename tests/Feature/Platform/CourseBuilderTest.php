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
        Storage::fake('public');
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
                'concept' => ['source' => 'upload', 'file' => UploadedFile::fake()->create('conceito.mp4', 1000, 'video/mp4'), 'duration_minutes' => 6],
                'example' => ['source' => 'url', 'url' => 'https://vimeo.com/123'],
                'common_errors' => ['source' => 'upload', 'file' => UploadedFile::fake()->create('erros.mp4', 1000, 'video/mp4')],
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

        $concept = $module->materials()->where('slot', 'concept')->first();
        Storage::disk('public')->assertExists($concept->file_path);
    }

    public function test_publishing_a_module_requires_all_three_videos_and_valid_exercises(): void
    {
        $payload = $this->modulePayload([
            'videos' => ['concept' => ['source' => 'url', 'url' => 'https://vimeo.com/1']],
            'exercises' => [['type' => 'multiple_choice', 'statement' => 'X?', 'points' => 1, 'options' => [
                ['text' => 'A', 'correct' => false], ['text' => 'B', 'correct' => false],
            ]]],
        ]);

        $this->actingAs($this->admin)->post('/administrador/modulos', $payload)
            ->assertSessionHasErrors(['videos.example', 'videos.common_errors', 'exercises.0.options']);

        // Rascunho pode ser salvo incompleto.
        $payload['status'] = 'draft';
        $payload['exercises'] = [];
        $this->post('/administrador/modulos', $payload)->assertSessionHasNoErrors();
    }

    public function test_updating_a_module_keeps_existing_files_and_removes_dropped_materials(): void
    {
        $this->actingAs($this->admin)->post('/administrador/modulos', $this->modulePayload());
        $module = CourseModule::first();
        $videos = $module->videos()->get()->keyBy('slot');
        $apostila = $module->supportMaterials()->where('type', 'document')->first();

        $this->put("/administrador/modulos/{$module->id}", $this->modulePayload([
            'videos' => [
                'concept' => ['id' => $videos['concept']->id, 'source' => 'upload'],
                'example' => ['id' => $videos['example']->id, 'source' => 'url', 'url' => 'https://vimeo.com/999'],
                'common_errors' => ['id' => $videos['common_errors']->id, 'source' => 'upload'],
            ],
            'support' => [],
        ]))->assertSessionHasNoErrors();

        $this->assertSame($videos['concept']->file_path, $videos['concept']->fresh()->file_path);
        $this->assertSame('https://vimeo.com/999', $videos['example']->fresh()->url);
        $this->assertSame(0, $module->supportMaterials()->count());
        Storage::disk('public')->assertMissing($apostila->file_path);
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
        Storage::disk('public')->assertExists($course->cover_path);
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
