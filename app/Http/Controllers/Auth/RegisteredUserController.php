<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'nullable|in:student,licensee',
            'phone' => 'nullable|string|max:20',
        ]);

        $isLicensee = $request->input('account_type') === 'licensee';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $isLicensee ? User::ROLE_LICENSEE_SIGNUP : 'student',
            'status' => $isLicensee ? User::STATUS_PENDING : User::STATUS_ACTIVE,
        ]);

        event(new Registered($user));

        // Licenciado só acessa após aprovação do administrador da plataforma.
        if ($isLicensee) {
            return redirect()->route('login')->with(
                'status',
                'Cadastro de licenciado recebido! Você poderá acessar assim que o administrador aprovar sua conta.'
            );
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
