<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Support\Media;
use Illuminate\Support\Str;

class Course extends Model
{
    public const STRUCTURE_MODULAR = 'modular';
    public const STRUCTURE_FREE = 'free';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'level',
        'workload_hours',
        'cover_path',
        'structure',
        'status',
        'created_by',
    ];

    protected $appends = ['cover_url'];

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(CourseModule::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }

    /** Materiais avulsos (cursos sem módulos). */
    public function materials(): MorphMany
    {
        return $this->morphMany(CourseMaterial::class, 'materialable')->orderBy('position');
    }

    /** Exercícios avulsos (cursos sem módulos). */
    public function exercises(): HasMany
    {
        return $this->hasMany(ModuleExercise::class)->orderBy('position');
    }

    public function getCoverUrlAttribute(): ?string
    {
        return Media::url($this->cover_path);
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'curso';
        $slug = $base;
        $i = 2;
        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
