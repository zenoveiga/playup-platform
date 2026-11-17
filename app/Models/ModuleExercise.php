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

    /** Curso ao qual o exercício pertence: o curso livre ou um curso que contém o módulo. */
    public function belongsToCourse(Course $course): bool
    {
        if ($this->course_id) {
            return $this->course_id === $course->id;
        }

        return $course->modules()->whereKey($this->course_module_id)->exists();
    }

    /**
     * Corrige a resposta. Devolve [is_correct, score]; is_correct null = aguarda correção manual.
     *
     * @return array{0: bool|null, 1: float|null}
     */
    public function grade(mixed $answer): array
    {
        $correct = match ($this->type) {
            'multiple_choice' => collect($this->options ?? [])
                ->keys()
                ->filter(fn ($i) => $this->options[$i]['correct'] ?? false)
                ->values()
                ->all() == collect((array) $answer)->map(fn ($v) => (int) $v)->unique()->sort()->values()->all(),
            'true_false' => $answer === $this->expected_answer,
            'short_answer' => filled($this->expected_answer)
                ? static::normalize((string) $answer) === static::normalize($this->expected_answer)
                : null,
            default => null, // dissertativa
        };

        return [$correct, $correct === null ? null : ($correct ? (float) $this->points : 0.0)];
    }

    private static function normalize(string $text): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/', ' ', \Illuminate\Support\Str::ascii($text))));
    }

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

    /** Curso livre ao qual o exercício pertence (quando não está em um módulo). */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
