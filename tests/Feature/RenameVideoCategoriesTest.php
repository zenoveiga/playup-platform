<?php

namespace Tests\Feature;

use App\Models\CourseMaterial;
use App\Models\CourseModule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RenameVideoCategoriesTest extends TestCase
{
    use RefreshDatabase;

    private CourseModule $module;

    protected function setUp(): void
    {
        parent::setUp();
        $this->module = CourseModule::create(['title' => 'Fundamentos', 'application_minutes' => 10]);
    }

    /** Grava direto no banco, como os dados antigos (sem passar pela normalização do model). */
    private function legacyVideo(string $category, int $pos): int
    {
        return DB::table('course_materials')->insertGetId([
            'materialable_type' => $this->module->getMorphClass(),
            'materialable_id' => $this->module->id,
            'slot' => 'video', 'type' => 'video', 'title' => "V$pos", 'url' => 'https://vimeo.com/1',
            'position' => $pos, 'category' => $category, 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function suggestions()
    {
        return $this->actingAs(User::factory()->create(['role' => 'super_admin']))
            ->get(route('platform.modules.edit', $this->module))
            ->assertOk();
    }

    private const EXPECTED = ['Conceito', 'Exemplo', 'Erros Comuns', 'Aplicação', 'Estudo de caso', 'Dica rápida', 'Minha categoria'];

    public function test_old_names_and_typos_are_not_suggested_twice_even_before_migrating(): void
    {
        foreach (['Revisão', ' revisão ', 'Erro Comum', 'Errors Comuns', 'erros comuns', 'Minha categoria'] as $i => $c) {
            $this->legacyVideo($c, $i);
        }

        $this->suggestions()->assertInertia(fn ($page) => $page
            ->where('videoCategories', self::EXPECTED)
            ->where('module.materials.2.category', 'Erros Comuns')
            ->where('module.materials.0.category', 'Aplicação'));
    }

    public function test_new_videos_are_saved_with_the_canonical_name(): void
    {
        $video = $this->module->materials()->create(['slot' => 'video', 'type' => 'video', 'title' => 'X', 'url' => 'https://vimeo.com/1', 'position' => 0, 'category' => 'erro comum']);

        $this->assertSame('Erros Comuns', DB::table('course_materials')->where('id', $video->id)->value('category'));
    }

    public function test_migrations_rewrite_saved_categories(): void
    {
        $ids = collect(['Revisão', ' revisão ', 'Erros comuns', 'Errors Comuns', 'Erro Comum', 'Minha categoria'])
            ->map(fn ($c, $i) => $this->legacyVideo($c, $i));

        (require database_path('migrations/2026_11_18_180000_rename_video_categories.php'))->up();
        (require database_path('migrations/2026_11_18_190000_unify_common_errors_category.php'))->up();

        $saved = $ids->map(fn ($id) => DB::table('course_materials')->where('id', $id)->value('category'))->all();
        $this->assertSame(['Aplicação', 'Aplicação', 'Erros Comuns', 'Erros Comuns', 'Erros Comuns', 'Minha categoria'], $saved);

        $this->suggestions()->assertInertia(fn ($page) => $page->where('videoCategories', self::EXPECTED));
        $this->assertSame(1, CourseMaterial::where('category', 'Minha categoria')->count());
    }
}
