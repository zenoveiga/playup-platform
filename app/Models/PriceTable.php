<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PriceTable extends Model
{
    protected $fillable = ['owner_id', 'name', 'description', 'max_installments', 'is_default'];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'max_installments' => 'integer',
        ];
    }

    /** Tabela de valores sugeridos pela plataforma (única, sem dono). */
    public static function suggested(): self
    {
        return static::firstOrCreate(
            ['owner_id' => null],
            ['name' => 'Tabela de valores sugeridos', 'max_installments' => 12]
        );
    }

    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('owner_id', $user->id);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PriceTableItem::class);
    }

    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class);
    }

    /** @return array<int, string> course_id => preço */
    public function priceMap(): array
    {
        return $this->items()->pluck('price', 'course_id')->all();
    }

    /** Substitui os preços da tabela. Cursos sem valor são removidos. */
    public function syncPrices(array $prices): void
    {
        $prices = collect($prices)->filter(fn ($p) => $p !== null && $p !== '');

        $this->items()->whereNotIn('course_id', $prices->keys())->delete();

        foreach ($prices as $courseId => $price) {
            $this->items()->updateOrCreate(['course_id' => $courseId], ['price' => $price]);
        }
    }
}
