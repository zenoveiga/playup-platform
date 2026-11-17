<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Campanha do licenciado: período (início/fim) em que um conjunto de tabelas de preços
 * fica disponível como opções de pagamento.
 */
class Campaign extends Model
{
    protected $fillable = ['licensee_id', 'name', 'description', 'starts_on', 'ends_on'];

    protected $appends = ['status'];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date:Y-m-d',
            'ends_on' => 'date:Y-m-d',
        ];
    }

    public function licensee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'licensee_id');
    }

    public function priceTables(): BelongsToMany
    {
        return $this->belongsToMany(PriceTable::class)->withPivot('position')->orderByPivot('position');
    }

    public function scopeActiveOn(Builder $query, $date = null): Builder
    {
        $date = ($date ?? today())->toDateString();

        return $query->whereDate('starts_on', '<=', $date)->whereDate('ends_on', '>=', $date);
    }

    /** scheduled (agendada), active (em andamento) ou ended (encerrada). */
    public function getStatusAttribute(): ?string
    {
        if (! $this->starts_on || ! $this->ends_on) {
            return null;
        }

        $today = today();

        return match (true) {
            $this->starts_on->gt($today) => 'scheduled',
            $this->ends_on->lt($today) => 'ended',
            default => 'active',
        };
    }
}
