<?php

namespace App\Http\Controllers\Licensee;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Campanhas do licenciado: período com data de início e fim em que tabelas de preços
 * ficam disponíveis como opções de pagamento.
 */
class CampaignController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Licensee/Campaigns/Index', [
            'campaigns' => $request->user()->campaigns()
                ->with('priceTables:id,name,max_installments')
                ->orderByDesc('starts_on')
                ->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        return $this->form($request, null);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($request, $data) {
            $campaign = $request->user()->campaigns()->create($data);
            $this->syncTables($campaign, $data['price_table_ids']);
        });

        return redirect()->route($this->routePrefix($request).'campaigns.index')
            ->with('success', 'Campanha criada.');
    }

    public function edit(Request $request, Campaign $campaign): Response
    {
        $this->authorizeOwner($request, $campaign);

        return $this->form($request, $campaign);
    }

    public function update(Request $request, Campaign $campaign): RedirectResponse
    {
        $this->authorizeOwner($request, $campaign);
        $data = $this->validated($request);

        DB::transaction(function () use ($campaign, $data) {
            $campaign->update($data);
            $this->syncTables($campaign, $data['price_table_ids']);
        });

        return back()->with('success', 'Campanha atualizada.');
    }

    public function destroy(Request $request, Campaign $campaign): RedirectResponse
    {
        $this->authorizeOwner($request, $campaign);
        $campaign->delete();

        return redirect()->route($this->routePrefix($request).'campaigns.index')
            ->with('success', 'Campanha removida.');
    }

    private function form(Request $request, ?Campaign $campaign): Response
    {
        return Inertia::render('Licensee/Campaigns/Form', [
            'campaign' => $campaign ? [
                ...$campaign->only(['id', 'name', 'description', 'status']),
                'starts_on' => $campaign->starts_on->toDateString(),
                'ends_on' => $campaign->ends_on->toDateString(),
                'price_table_ids' => $campaign->priceTables()->pluck('price_tables.id'),
            ] : null,
            'priceTables' => $request->user()->priceTables()
                ->withCount('items')
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get(['id', 'name', 'description', 'max_installments', 'is_default']),
        ]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:120',
            'description' => 'nullable|string|max:2000',
            'starts_on' => 'required|date',
            'ends_on' => 'required|date|after_or_equal:starts_on',
            'price_table_ids' => 'required|array|min:1',
            'price_table_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('price_tables', 'id')->where('owner_id', $request->user()->id),
            ],
        ], [
            'ends_on.after_or_equal' => 'A data de fim deve ser igual ou posterior à data de início.',
            'price_table_ids.required' => 'Selecione ao menos uma tabela de preços.',
        ], [
            'name' => 'nome', 'starts_on' => 'data de início', 'ends_on' => 'data de fim',
            'price_table_ids.*' => 'tabela de preços',
        ]);
    }

    private function syncTables(Campaign $campaign, array $ids): void
    {
        $campaign->priceTables()->sync(
            collect($ids)->values()->mapWithKeys(fn ($id, $position) => [$id => ['position' => $position]])->all()
        );
    }

    private function authorizeOwner(Request $request, Campaign $campaign): void
    {
        abort_unless($campaign->licensee_id === $request->user()->id, 404);
    }

    private function routePrefix(Request $request): string
    {
        return $request->user()->role === 'school_admin' ? 'school-admin.' : 'admin.';
    }
}
