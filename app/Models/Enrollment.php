<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Acesso de um aluno a um curso, com início e (opcionalmente) fim. */
class Enrollment extends Model
{
    protected $fillable = ['student_id', 'course_id', 'licensee_id', 'sale_item_id', 'status', 'starts_at', 'expires_at'];

    protected $appends = ['access_status'];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime:Y-m-d H:i:s',
            'expires_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    /** Acesso válido agora. */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }

    /** active, scheduled (ainda não começou), expired ou canceled. */
    public function getAccessStatusAttribute(): string
    {
        return match (true) {
            $this->status === 'canceled' => 'canceled',
            $this->starts_at->isFuture() => 'scheduled',
            $this->expires_at && $this->expires_at->isPast() => 'expired',
            default => 'active',
        };
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function saleItem(): BelongsTo
    {
        return $this->belongsTo(SaleItem::class);
    }
}
