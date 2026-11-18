<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    protected $table = 'lesson_progress';

    public const TYPES = ['video', 'exercise_set', 'application', 'material'];

    /** Parte do vídeo que precisa ser assistida para a aula contar como concluída. */
    public const VIDEO_COMPLETION = 0.85;

    protected $fillable = [
        'student_id', 'course_id', 'lesson_type', 'lesson_id',
        'time_spent_seconds', 'watched_seconds', 'duration_seconds', 'last_position_seconds',
        'views', 'completed_at', 'first_seen_at', 'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'time_spent_seconds' => 'integer',
            'watched_seconds' => 'integer',
            'duration_seconds' => 'integer',
            'last_position_seconds' => 'integer',
            'views' => 'integer',
            'completed_at' => 'datetime',
            'first_seen_at' => 'datetime',
            'last_seen_at' => 'datetime',
        ];
    }

    public function key(): string
    {
        return "{$this->lesson_type}:{$this->lesson_id}";
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
