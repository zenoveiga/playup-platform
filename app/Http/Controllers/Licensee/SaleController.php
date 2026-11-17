<?php

namespace App\Http\Controllers\Licensee;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Sale;
use App\Models\User;
use App\Services\LicenseePricing;
use App\Services\SaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/** Vendas de cursos do licenciado para seus alunos. */
class SaleController extends Controller
{
    public function __construct(private SaleService $sales) {}

    public function index(Request $request): Response
    {
        $sales = $request->user()->sales()
            ->with(['student:id,name,email', 'items:id,sale_id,course_title'])
            ->latest()
            ->get();

        $monthStart = now()->startOfMonth();

        return Inertia::render('Licensee/Sales/Index', [
            'sales' => $sales,
            'stats' => [
                'month_total' => $sales->where('status', 'paid')->where('paid_at', '>=', $monthStart)->sum('total'),
                'month_count' => $sales->where('status', 'paid')->where('paid_at', '>=', $monthStart)->count(),
                'pending_total' => $sales->where('status', 'pending')->sum('total'),
                'pending_count' => $sales->where('status', 'pending')->count(),
            ],
            'paymentMethods' => Sale::PAYMENT_METHODS,
        ]);
    }

    public function create(Request $request, LicenseePricing $pricing): Response
    {
        $licensee = $request->user();

        return Inertia::render('Licensee/Sales/Create', [
            'students' => $licensee->students()->whereIn('status', ['active', 'inactive'])->orderBy('name')->get(['id', 'name', 'email', 'phone']),
            'courses' => Course::where('status', 'published')->orderBy('title')->get(['id', 'title', 'category', 'workload_hours', 'cover_path', 'structure']),
            'priceOptions' => (object) $pricing->priceOptions($licensee),
            'paymentMethods' => Sale::PAYMENT_METHODS,
            'preselectedStudentId' => $request->integer('aluno') ?: null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $licensee = $request->user();

        $data = $request->validate([
            'student_id' => ['required', 'integer', Rule::exists('users', 'id')->where('role', 'student')->where('licensee_id', $licensee->id)],
            'payment_method' => ['required', Rule::in(array_keys(Sale::PAYMENT_METHODS))],
            'installments' => 'required|integer|min:1|max:24',
            'status' => 'required|in:paid,pending',
            'access_starts_on' => 'required|date',
            'notes' => 'nullable|string|max:2000',
            'items' => 'required|array|min:1',
            'items.*.course_id' => 'required|integer|distinct',
            'items.*.price_option' => 'required|string|max:100',
            'items.*.manual_price' => 'nullable|required_if:items.*.price_option,manual|numeric|min:0|max:9999999',
            'items.*.discount' => 'nullable|numeric|min:0|max:9999999',
            'items.*.access_days' => 'nullable|integer|min:1|max:36500',
        ], [
            'items.required' => 'Adicione ao menos um curso à venda.',
            'items.*.course_id.distinct' => 'Este curso já está na venda.',
            'student_id.exists' => 'Selecione um aluno seu.',
        ], [
            'student_id' => 'aluno', 'payment_method' => 'forma de pagamento', 'installments' => 'parcelas',
            'access_starts_on' => 'início do acesso', 'items.*.manual_price' => 'valor', 'items.*.discount' => 'desconto',
            'items.*.access_days' => 'tempo de acesso',
        ]);

        $sale = $this->sales->create($licensee, $data, $request->user());

        return redirect()->route($this->routePrefix($request).'sales.show', $sale)
            ->with('success', $sale->status === 'paid'
                ? "Venda {$sale->code} registrada. O acesso do aluno já foi liberado."
                : "Venda {$sale->code} registrada como aguardando pagamento.");
    }

    public function show(Request $request, Sale $sale): Response
    {
        $this->authorizeOwner($request, $sale);

        $sale->load(['student:id,name,email,phone', 'campaign:id,name,starts_on,ends_on', 'items.enrollment']);

        return Inertia::render('Licensee/Sales/Show', [
            'sale' => $sale,
            'paymentMethods' => Sale::PAYMENT_METHODS,
        ]);
    }

    public function pay(Request $request, Sale $sale): RedirectResponse
    {
        $this->authorizeOwner($request, $sale);
        abort_unless($sale->status === 'pending', 422);

        $this->sales->markPaid($sale);

        return back()->with('success', 'Pagamento confirmado. O acesso do aluno foi liberado.');
    }

    public function cancel(Request $request, Sale $sale): RedirectResponse
    {
        $this->authorizeOwner($request, $sale);
        abort_if($sale->status === 'canceled', 422);

        $data = $request->validate(['reason' => 'nullable|string|max:500']);
        $this->sales->cancel($sale, $data['reason'] ?? null);

        return back()->with('success', 'Venda cancelada. O acesso aos cursos foi revogado.');
    }

    private function authorizeOwner(Request $request, Sale $sale): void
    {
        abort_unless($sale->licensee_id === $request->user()->id, 404);
    }

    private function routePrefix(Request $request): string
    {
        return $request->user()->role === 'school_admin' ? 'school-admin.' : 'admin.';
    }
}
