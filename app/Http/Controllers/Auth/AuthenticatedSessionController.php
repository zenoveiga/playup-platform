<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Tela de login exclusiva do administrador da plataforma.
     */
    public function createPlatform(): Response
    {
        return Inertia::render('Platform/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Autenticação do administrador da plataforma.
     */
    public function storePlatform(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        if (! $request->user()->isPlatformAdmin()) {
            Auth::guard('web')->logout();

            throw ValidationException::withMessages([
                'email' => 'Esta área é exclusiva para administradores da plataforma.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('platform.dashboard', absolute: false));
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $wasPlatformAdmin = $request->user()?->isPlatformAdmin();

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return $wasPlatformAdmin ? redirect()->route('platform.login') : redirect('/');
    }
}
