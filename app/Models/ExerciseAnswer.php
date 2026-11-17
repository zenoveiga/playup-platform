<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseAnswer extends Model
{
    protected $fillable = ['student_id', 'module_exercise_id', 'course_id', 'answer', 'is_correct', 'score', 'attempts', 'answered_at'];

    protected function casts(): array
    {
        return [
            'answer' => 'array',
            'is_correct' => 'boolean',
            'score' => 'decimal:2',
            'attempts' => 'integer',
            'answered_at' => 'datetime',
        ];
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(ModuleExercise::class, 'module_exercise_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
