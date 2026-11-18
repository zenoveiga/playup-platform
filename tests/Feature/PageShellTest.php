<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * O HTML base é o mesmo para todos os perfis. Ele precisa declarar pt-BR e desligar a
 * tradução automática do navegador, que no celular traduzia os nomes dos ícones e quebrava o layout.
 */
class PageShellTest extends TestCase
{
    use RefreshDatabase;

    public static function pages(): array
    {
        return [
            'visitante' => [null, '/login'],
            'aluno' => ['student', '/student/dashboard'],
            'school_admin' => ['school_admin', '/school-admin/dashboard'],
            'licenciado (admin)' => ['admin', '/admin/dashboard'],
            'plataforma' => ['super_admin', '/administrador/dashboard'],
        ];
    }

    #[DataProvider('pages')]
    public function test_every_role_gets_portuguese_page_without_auto_translation(?string $role, string $url): void
    {
        if ($role) {
            $this->actingAs(User::factory()->create(['role' => $role]));
        }

        $html = $this->get($url)->assertOk()->getContent();

        $this->assertStringContainsString('<html lang="pt-BR" translate="no"', $html);
        $this->assertStringContainsString('<meta name="google" content="notranslate">', $html);
    }
}
