<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/** Venda de cursos do licenciado para um aluno. */
class Sale extends Model
{
    public const PAYMENT_METHODS = [
        'pix' => 'Pix',
        'credit_card' => 'Cartão de crédito',
        'debit_card' => 'Cartão de débito',
        'boleto' => 'Boleto',
        'cash' => 'Dinheiro',
        'bank_transfer' => 'Transferência',
    ];

    protected $fillable = [
        'code', 'licensee_id', 'student_id', 'campaign_id', 'payment_method', 'installments',
        'subtotal', 'discount', 'total', 'status', 'access_starts_on', 'paid_at', 'canceled_at',
        'cancel_reason', 'notes', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'installments' => 'integer',
            'access_starts_on' => 'date:Y-m-d',
            'paid_at' => 'datetime',
            'canceled_at' => 'datetime',
        ];
    }

    public static function nextCode(): string
    {
        return 'VND-'.str_pad((string) ((static::max('id') ?? 0) + 1), 6, '0', STR_PAD_LEFT);
    }

    public function licensee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'licensee_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function enrollments(): HasManyThrough
    {
        return $this->hasManyThrough(Enrollment::class, SaleItem::class);
    }
}
