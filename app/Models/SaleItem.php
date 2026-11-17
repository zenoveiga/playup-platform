<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SaleItem extends Model
{
    protected $fillable = [
        'course_id', 'course_title', 'price_table_id', 'price_source', 'price_label',
        'list_price', 'discount', 'total', 'access_days',
    ];

    protected function casts(): array
    {
        return [
            'list_price' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'access_days' => 'integer',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment(): HasOne
    {
        return $this->hasOne(Enrollment::class);
    }
}
