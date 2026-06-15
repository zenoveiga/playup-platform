<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Polo extends Model
{
    protected $fillable = [
        'code',
        'name',
        'responsible',
        'phone',
        'email',
        'address',
        'status',
        'active_students',
        'capacity_pct',
    ];
}
