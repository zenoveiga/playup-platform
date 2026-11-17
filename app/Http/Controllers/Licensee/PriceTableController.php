<?php

namespace App\Http\Controllers\Licensee;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PriceTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/** Tabelas de preços próprias do licenciado. */
class PriceTableController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Licensee/PriceTables/Index', [
            'tables' => $request->user()->priceTables()
                ->withCount(['items', 'campaigns'])
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get(),
            'publishedCourses' => Course::where('status', 'published')->count(),
        ]);
    }

    public function create(Request $request): Response
    {
        return $this->form($request, null);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $table = DB::transaction(function () use ($request, $data) {
            $table = $request->user()->priceTables()->create($this->attributes($request, $data));
            $this->afterSave($request, $table, $data);

            return $table;
        });

        return redirect()->route($this->routePrefix($request).'price-tables.edit', $table)
            ->with('success', 'Tabela de preços criada.');
    }

    public function edit(Request $request, PriceTable $priceTable): Response
    {
        $this->authorizeOwner($request, $priceTable);

        return $this->form($request, $priceTable);
    }

    public function update(Request $request, PriceTable $priceTable): RedirectResponse
    {
        $this->authorizeOwner($request, $priceTable);
        $data = $this->validated($request);

        DB::transaction(function () use ($request, $priceTable, $data) {
            $priceTable->update($this->attributes($request, $data));
            $this->afterSave($request, $priceTable, $data);
        });

        return back()->with('success', 'Tabela de preços atualizada.');
    }

    public function destroy(Request $request, PriceTable $priceTable): RedirectResponse
    {
        $this->authorizeOwner($request, $priceTable);
        $priceTable->delete();

        return redirect()->route($this->routePrefix($request).'price-tables.index')
            ->with('success', 'Tabela de preços removida.');
    }

    private function form(Request $request, ?PriceTable $table): Response
    {
        return Inertia::render('Licensee/PriceTables/Form', [
            'table' => $table?->only(['id', 'name', 'description', 'max_installments', 'is_default']),
            'prices' => (object) ($table?->priceMap() ?? []),
            'suggestedPrices' => (object) PriceTable::suggested()->priceMap(),
            'courses' => Course::where('status', 'published')->orderBy('title')->get(['id', 'title', 'category', 'workload_hours', 'structure']),
            'campaigns' => $table ? $table->campaigns()->get(['campaigns.id', 'name', 'starts_on', 'ends_on']) : [],
            'isFirstTable' => ! $request->user()->priceTables()->exists(),
        ]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:120',
            'description' => 'nullable|string|max:500',
            'max_installments' => 'required|integer|min:1|max:24',
            'is_default' => 'nullable|boolean',
            'prices' => 'nullable|array',
            'prices.*' => 'nullable|numeric|min:0|max:9999999',
        ], [], ['name' => 'nome', 'prices.*' => 'valor', 'max_installments' => 'parcelas']);
    }

    private function attributes(Request $request, array $data): array
    {
        // A primeira tabela do licenciado vira a padrão automaticamente.
        $isDefault = (bool) ($data['is_default'] ?? false) || ! $request->user()->priceTables()->exists();

        return [
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'max_installments' => $data['max_installments'],
            'is_default' => $isDefault,
        ];
    }

    private function afterSave(Request $request, PriceTable $table, array $data): void
    {
        if ($table->is_default) {
            $request->user()->priceTables()->whereKeyNot($table->id)->update(['is_default' => false]);
        }

        $courseIds = Course::where('status', 'published')->pluck('id')->all();
        $table->syncPrices(collect($data['prices'] ?? [])->only($courseIds)->all());
    }

    private function authorizeOwner(Request $request, PriceTable $table): void
    {
        abort_unless($table->owner_id === $request->user()->id, 404);
    }

    private function routePrefix(Request $request): string
    {
        return $request->user()->role === 'school_admin' ? 'school-admin.' : 'admin.';
    }
}
