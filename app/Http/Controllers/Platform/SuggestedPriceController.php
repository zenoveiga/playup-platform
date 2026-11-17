<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PriceTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Tabela de valores sugeridos pela plataforma. Serve de referência para os licenciados,
 * que podem montar as próprias tabelas a partir dela.
 */
class SuggestedPriceController extends Controller
{
    public function index(): Response
    {
        $table = PriceTable::suggested();

        return Inertia::render('Platform/Pricing/Index', [
            'table' => $table->only(['id', 'name', 'max_installments', 'updated_at']),
            'prices' => (object) $table->priceMap(),
            'courses' => Course::orderBy('title')->get(['id', 'title', 'category', 'status', 'structure', 'workload_hours', 'cover_path']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'max_installments' => 'required|integer|min:1|max:24',
            'prices' => 'nullable|array',
            'prices.*' => 'nullable|numeric|min:0|max:9999999',
        ], [], ['prices.*' => 'valor']);

        $courseIds = Course::pluck('id')->all();
        $prices = collect($data['prices'] ?? [])->only($courseIds)->all();

        $table = PriceTable::suggested();
        $table->update(['max_installments' => $data['max_installments']]);
        $table->syncPrices($prices);

        return back()->with('success', 'Tabela de valores sugeridos atualizada.');
    }
}
