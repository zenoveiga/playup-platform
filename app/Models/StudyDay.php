<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Tempo de estudo de um aluno num curso em um dia. */
class StudyDay extends Model
{
    protected $fillable = ['student_id', 'course_id', 'date', 'seconds'];

    protected function casts(): array
    {
        return ['date' => 'date', 'seconds' => 'integer'];
    }

    public static function add(int $studentId, int $courseId, int $seconds): void
    {
        if ($seconds <= 0) {
            return;
        }

        $today = now()->toDateString();
        $updated = static::where('student_id', $studentId)->where('course_id', $courseId)
            ->whereDate('date', $today)
            ->increment('seconds', $seconds);

        if (! $updated) {
            static::create(['student_id' => $studentId, 'course_id' => $courseId, 'date' => $today, 'seconds' => $seconds]);
        }
    }
}
