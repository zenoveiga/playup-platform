<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Módulo de curso: 1 vídeo conceito (~6 min), 1 vídeo exemplo, aplicação (~10 min),
 * 1 vídeo de erros comuns, materiais de apoio e exercícios.
 */
class CourseModule extends Model
{
    public const VIDEO_SLOTS = ['concept', 'example', 'common_errors'];

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
        return $this->materials()->whereIn('slot', self::VIDEO_SLOTS);
    }

    public function supportMaterials(): MorphMany
    {
        return $this->materials()->where('slot', 'support');
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(ModuleExercise::class)->orderBy('position');
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class)->withPivot('position');
    }
}
