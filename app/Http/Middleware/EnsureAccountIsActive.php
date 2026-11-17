<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Encerra a sessão de contas pendentes, reprovadas ou bloqueadas
 * (ex.: licenciado bloqueado enquanto estava logado).
 */
class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && in_array($user->status, [User::STATUS_PENDING, User::STATUS_BLOCKED, 'rejected'], true)) {
            $isPlatform = $user->isPlatformAdmin();

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route($isPlatform ? 'platform.login' : 'login')
                ->with('status', self::messageFor($user->status));
        }

        return $next($request);
    }

    public static function messageFor(string $status): string
    {
        return match ($status) {
            User::STATUS_PENDING => 'Seu cadastro está aguardando aprovação do administrador.',
            'rejected' => 'Seu cadastro não foi aprovado. Entre em contato com o suporte.',
            default => 'Seu acesso está bloqueado. Entre em contato com o suporte.',
        };
    }
}
