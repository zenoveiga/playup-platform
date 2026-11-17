<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Course;
use App\Models\PriceTable;
use App\Models\User;

/**
 * Monta o catálogo de cursos publicados com os preços de um licenciado:
 * valor sugerido pela plataforma, valor da tabela padrão do licenciado
 * e as opções de pagamento das campanhas em andamento.
 */
class LicenseePricing
{
    public function catalog(User $licensee): array
    {
        $courses = Course::where('status', 'published')
            ->withCount(['modules', 'materials', 'exercises'])
            ->orderBy('title')
            ->get();

        $suggested = PriceTable::suggested();
        $suggestedPrices = $suggested->priceMap();

        $default = $licensee->priceTables()->where('is_default', true)->first();
        $defaultPrices = $default?->priceMap() ?? [];

        $activeCampaigns = $licensee->campaigns()
            ->activeOn()
            ->with('priceTables.items')
            ->orderBy('ends_on')
            ->get();

        return [
            'courses' => $courses->map(function (Course $course) use ($suggestedPrices, $defaultPrices, $activeCampaigns) {
                $campaignOptions = $activeCampaigns->flatMap(fn (Campaign $campaign) => $campaign->priceTables
                    ->map(function (PriceTable $table) use ($campaign, $course) {
                        $item = $table->items->firstWhere('course_id', $course->id);

                        return $item ? [
                            'campaign' => $campaign->name,
                            'campaign_ends_on' => $campaign->ends_on->toDateString(),
                            'table' => $table->name,
                            'price' => $item->price,
                            'max_installments' => $table->max_installments,
                        ] : null;
                    })
                    ->filter()
                )->values();

                $mine = $defaultPrices[$course->id] ?? null;

                return [
                    ...$course->only(['id', 'title', 'description', 'category', 'level', 'workload_hours', 'structure', 'cover_url', 'modules_count', 'materials_count', 'exercises_count']),
                    'suggested_price' => $suggestedPrices[$course->id] ?? null,
                    'my_price' => $mine,
                    'campaign_options' => $campaignOptions,
                ];
            })->values(),
            'suggestedTable' => $suggested->only(['id', 'name', 'max_installments']),
            'defaultTable' => $default?->only(['id', 'name', 'max_installments']),
            'activeCampaigns' => $activeCampaigns->map->only(['id', 'name', 'starts_on', 'ends_on'])->values(),
        ];
    }

    /**
     * Opções de preço por curso para a tela de venda.
     * Cada opção: key, source, label, price, max_installments, price_table_id?, campaign_id?
     *
     * @return array<int, array<int, array<string, mixed>>> course_id => opções
     */
    public function priceOptions(User $licensee): array
    {
        $suggested = PriceTable::suggested()->load('items');
        $tables = $licensee->priceTables()->with('items')->orderByDesc('is_default')->orderBy('name')->get();
        $campaigns = $licensee->campaigns()->activeOn()->with('priceTables.items')->get();

        $options = [];
        $add = function (int $courseId, array $option) use (&$options) {
            $options[$courseId][] = $option;
        };

        foreach ($campaigns as $campaign) {
            foreach ($campaign->priceTables as $table) {
                foreach ($table->items as $item) {
                    $add($item->course_id, [
                        'key' => "campaign:{$campaign->id}:{$table->id}",
                        'source' => 'campaign',
                        'label' => "{$campaign->name} · {$table->name}",
                        'price' => $item->price,
                        'max_installments' => $table->max_installments,
                        'price_table_id' => $table->id,
                        'campaign_id' => $campaign->id,
                    ]);
                }
            }
        }

        foreach ($tables as $table) {
            foreach ($table->items as $item) {
                $add($item->course_id, [
                    'key' => "table:{$table->id}",
                    'source' => 'price_table',
                    'label' => $table->name.($table->is_default ? ' (padrão)' : ''),
                    'price' => $item->price,
                    'max_installments' => $table->max_installments,
                    'price_table_id' => $table->id,
                    'campaign_id' => null,
                    'is_default' => $table->is_default,
                ]);
            }
        }

        foreach ($suggested->items as $item) {
            $add($item->course_id, [
                'key' => 'suggested',
                'source' => 'suggested',
                'label' => 'Valor sugerido PlayUp',
                'price' => $item->price,
                'max_installments' => $suggested->max_installments,
                'price_table_id' => $suggested->id,
                'campaign_id' => null,
            ]);
        }

        return $options;
    }
}
