<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Módulo de curso: lista ordenada de vídeos categorizados (conceito, exemplo, erros comuns...),
 * bloco de aplicação (~10 min), materiais de apoio e exercícios.
 */
class CourseModule extends Model
{
    public const VIDEO_SLOT = 'video';

    protected $fillable = [
        'title',
        'description',
        'objectives',
        'application_minutes',
        'application_instructions',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'application_minutes' => 'integer',
        ];
    }

    public function materials(): MorphMany
    {
        return $this->morphMany(CourseMaterial::class, 'materialable')->orderBy('position');
    }

    public function videos(): MorphMany
    {
        return $this->materials()->where('slot', self::VIDEO_SLOT);
    }

    public function supportMaterials(): MorphMany
    {
        return $this->materials()->where('slot', 'support');
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(ModuleExercise::class)->orderBy('position');
    }

    /** Exercícios (com título), cada um com suas questões. */
    public function exerciseSets(): HasMany
    {
        return $this->hasMany(ExerciseSet::class)->orderBy('position');
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)->withPivot('position');
    }
}
