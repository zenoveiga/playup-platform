<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Usuários com acesso ao painel do administrador da plataforma.
 */
class PlatformUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Platform/Users/Index', [
            'users' => User::platformAdmins()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            ...$data,
            'role' => User::ROLE_PLATFORM_ADMIN,
            'status' => User::STATUS_ACTIVE,
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Administrador adicionado com sucesso.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->ensurePlatformAdmin($user);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return back()->with('success', 'Dados do administrador atualizados.');
    }

    public function block(Request $request, User $user): RedirectResponse
    {
        $this->ensurePlatformAdmin($user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'Você não pode bloquear ou remover a si mesmo.');
        }

        $data = $request->validate(['reason' => 'nullable|string|max:500']);

        $user->forceFill([
            'status' => User::STATUS_BLOCKED,
            'blocked_at' => now(),
            'blocked_reason' => $data['reason'] ?? null,
        ])->save();

        return back()->with('success', "Acesso de {$user->name} bloqueado.");
    }

    public function unblock(User $user): RedirectResponse
    {
        $this->ensurePlatformAdmin($user);

        $user->forceFill([
            'status' => User::STATUS_ACTIVE,
            'blocked_at' => null,
            'blocked_reason' => null,
        ])->save();

        return back()->with('success', "Acesso de {$user->name} restabelecido.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->ensurePlatformAdmin($user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'Você não pode bloquear ou remover a si mesmo.');
        }

        $user->delete();

        return back()->with('success', 'Administrador removido.');
    }

    private function ensurePlatformAdmin(User $user): void
    {
        abort_unless($user->isPlatformAdmin(), 404);
    }
}
