<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Exercício com título, composto por várias questões. Pertence a um módulo ou a um curso livre. */
class ExerciseSet extends Model
{
    protected $fillable = ['title', 'description', 'position'];

    public function questions(): HasMany
    {
        return $this->hasMany(ModuleExercise::class)->orderBy('position');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
