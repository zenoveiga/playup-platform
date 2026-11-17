<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LicenseeAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LicenseeController extends Controller
{
    public function __construct(private LicenseeAccess $access) {}

    public function index(): Response
    {
        $licensees = User::licensees()
            ->withCount('students')
            ->withCount(['students as blocked_students_count' => fn ($q) => $q->where('blocked_via_licensee', true)])
            ->with('approver:id,name')
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 WHEN 'blocked' THEN 1 ELSE 2 END")
            ->latest()
            ->get();

        return Inertia::render('Platform/Licensees/Index', [
            'licensees' => $licensees,
        ]);
    }

    public function approve(Request $request, User $licensee): RedirectResponse
    {
        $this->ensureLicensee($licensee);
        $this->access->approve($licensee, $request->user());

        return back()->with('success', "Licenciado {$licensee->name} aprovado com sucesso.");
    }

    public function reject(Request $request, User $licensee): RedirectResponse
    {
        $this->ensureLicensee($licensee);
        $data = $request->validate(['reason' => 'nullable|string|max:500']);
        $this->access->reject($licensee, $data['reason'] ?? null);

        return back()->with('success', "Cadastro de {$licensee->name} reprovado.");
    }

    public function block(Request $request, User $licensee): RedirectResponse
    {
        $this->ensureLicensee($licensee);
        $data = $request->validate([
            'reason' => 'nullable|string|max:500',
            'extend_to_students' => 'required|boolean',
        ]);

        $this->access->block($licensee, $data['reason'] ?? null, (bool) $data['extend_to_students']);

        $message = $data['extend_to_students']
            ? "Acesso de {$licensee->name} e de seus alunos bloqueado."
            : "Acesso de {$licensee->name} bloqueado. Os alunos continuam com acesso.";

        return back()->with('success', $message);
    }

    public function unblock(User $licensee): RedirectResponse
    {
        $this->ensureLicensee($licensee);
        $this->access->unblock($licensee);

        return back()->with('success', "Acesso de {$licensee->name} restabelecido.");
    }

    private function ensureLicensee(User $user): void
    {
        abort_unless($user->isLicensee(), 404);
    }
}
