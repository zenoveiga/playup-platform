<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleExercise extends Model
{
    public const TYPES = ['multiple_choice', 'true_false', 'short_answer', 'essay'];

    protected $fillable = [
        'position',
        'type',
        'statement',
        'options',
        'expected_answer',
        'points',
        'explanation',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'points' => 'integer',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }
}
