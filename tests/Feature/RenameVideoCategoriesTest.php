<?php

namespace Tests\Feature;

use App\Models\CourseModule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RenameVideoCategoriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_old_category_names_are_renamed_and_no_longer_suggested(): void
    {
        $module = CourseModule::create(['title' => 'Fundamentos', 'application_minutes' => 10]);
        $video = fn (string $category, int $pos) => $module->materials()->create([
            'slot' => 'video', 'type' => 'video', 'title' => "V$pos", 'url' => 'https://vimeo.com/1', 'position' => $pos, 'category' => $category,
        ]);
        $revisao = $video('Revisão', 0);
        $revisaoEspaco = $video(' revisão ', 1);
        $erros = $video('Erros comuns', 2);
        $outra = $video('Minha categoria', 3);

        (require database_path('migrations/2026_11_18_180000_rename_video_categories.php'))->up();

        $this->assertSame('Aplicação', $revisao->fresh()->category);
        $this->assertSame('Aplicação', $revisaoEspaco->fresh()->category);
        $this->assertSame('Erro comum', $erros->fresh()->category);
        $this->assertSame('Minha categoria', $outra->fresh()->category);

        // As sugestões do construtor de módulos não repetem mais os nomes antigos.
        $this->actingAs(User::factory()->create(['role' => 'super_admin']))
            ->get(route('platform.modules.edit', $module))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('videoCategories', [
                'Conceito', 'Exemplo', 'Erro comum', 'Aplicação', 'Estudo de caso', 'Dica rápida', 'Minha categoria',
            ]));
    }
}
