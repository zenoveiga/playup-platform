<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseModule;
use App\Models\ExerciseAnswer;
use App\Models\ExerciseSet;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Aulas do curso e progresso dos alunos.
 *
 * Aulas que contam no progresso: vídeos, aplicação prática e exercícios (materiais de apoio
 * são registrados como engajamento, mas não entram na porcentagem).
 * Chave de cada aula: "video:<material>", "application:<módulo>", "exercise_set:<exercício>".
 */
class CourseProgress
{
    /** Aulas do curso na ordem em que o aluno as vê. */
    public function lessons(Course $course): Collection
    {
        $course->loadMissing(['modules.materials', 'modules.exerciseSets.questions', 'materials', 'exerciseSets.questions']);

        if ($course->structure === Course::STRUCTURE_MODULAR) {
            return $course->modules->values()->flatMap(function (CourseModule $m, int $mi) {
                $items = collect()
                    ->merge($m->materials->where('slot', CourseModule::VIDEO_SLOT)->values()->map(fn ($v) => $this->video($v, "video:{$v->id}")))
                    ->merge(filled($m->application_instructions) ? [[
                        'key' => "application:{$m->id}",
                        'token' => 'application',
                        'type' => 'application',
                        'id' => $m->id,
                        'title' => 'Aplicação prática',
                        'subtitle' => "{$m->application_minutes} min",
                        'duration_seconds' => null,
                    ]] : [])
                    ->merge($this->sets($m->exerciseSets));

                return $this->ordered($items, $m->outline)->map(fn ($l) => $l + [
                    'module_id' => $m->id,
                    'module_title' => 'Módulo '.($mi + 1).': '.$m->title,
                ]);
            })->values();
        }

        $items = collect()
            ->merge($course->materials->where('type', 'video')->values()->map(fn ($v) => $this->video($v, "material:{$v->id}")))
            ->merge($this->sets($course->exerciseSets));

        return $this->ordered($items, $course->outline)->map(fn ($l) => $l + ['module_id' => null, 'module_title' => null])->values();
    }

    /**
     * Situação de um aluno em cada aula.
     *
     * @param  Collection<string, LessonProgress>  $rows  progresso do aluno, por chave
     * @param  Collection<int, ExerciseAnswer>  $answers  respostas do aluno, por questão
     */
    public function status(Collection $lessons, Collection $rows, Collection $answers): array
    {
        $result = [];
        foreach ($lessons as $lesson) {
            $row = $rows->get($lesson['key']);
            $item = [
                'completed' => (bool) $row?->completed_at,
                'time_spent' => $row?->time_spent_seconds ?? 0,
                'views' => $row?->views ?? 0,
                'last_seen_at' => $row?->last_seen_at?->toDateTimeString(),
            ];

            if ($lesson['type'] === 'video') {
                $duration = $row?->duration_seconds ?: $lesson['duration_seconds'];
                $item['watched'] = $row?->watched_seconds ?? 0;
                $item['watched_pct'] = $duration ? min(100, (int) round(($item['watched'] / $duration) * 100)) : null;
                $item['last_position'] = $row?->last_position_seconds ?? 0;
            }

            if ($lesson['type'] === 'exercise_set') {
                $given = collect($lesson['question_ids'])->map(fn ($id) => $answers->get($id))->filter();
                $item['answered'] = $given->count();
                $item['questions'] = count($lesson['question_ids']);
                $item['score'] = round((float) $given->sum('score'), 2);
                $item['max_score'] = $lesson['max_score'];
                $item['completed'] = $item['questions'] > 0 && $item['answered'] === $item['questions'];
                $item['time_spent'] = $row?->time_spent_seconds ?? 0;
            }

            $result[$lesson['key']] = $item;
        }

        $total = count($result);
        $done = collect($result)->where('completed', true)->count();

        return [
            'lessons' => $result,
            'completed' => $done,
            'total' => $total,
            'percent' => $total ? (int) floor(($done / $total) * 100) : 0,
            'time_spent' => collect($result)->sum('time_spent'),
            'last_seen_at' => collect($result)->pluck('last_seen_at')->filter()->max(),
        ];
    }

    /** Situação de um aluno num curso. */
    public function forStudent(Course $course, User $student, ?Collection $lessons = null): array
    {
        $lessons ??= $this->lessons($course);

        return $this->status($lessons, $this->rows($course, [$student->id])->get($student->id, collect()), $this->answers($course, [$student->id])->get($student->id, collect()));
    }

    /** Progresso de vários alunos de uma vez: student_id => status. */
    public function forStudents(Course $course, array $studentIds, ?Collection $lessons = null): Collection
    {
        $lessons ??= $this->lessons($course);
        $rows = $this->rows($course, $studentIds);
        $answers = $this->answers($course, $studentIds);

        return collect($studentIds)->mapWithKeys(fn ($id) => [
            $id => $this->status($lessons, $rows->get($id, collect()), $answers->get($id, collect())),
        ]);
    }

    /** student_id => (chave => LessonProgress) */
    public function rows(Course $course, array $studentIds): Collection
    {
        return LessonProgress::where('course_id', $course->id)
            ->whereIn('student_id', $studentIds)
            ->get()
            ->groupBy('student_id')
            ->map(fn ($rows) => $rows->keyBy(fn (LessonProgress $p) => $p->key()));
    }

    /** student_id => (questão => resposta) */
    private function answers(Course $course, array $studentIds): Collection
    {
        return ExerciseAnswer::where('course_id', $course->id)
            ->whereIn('student_id', $studentIds)
            ->get(['student_id', 'module_exercise_id', 'score'])
            ->groupBy('student_id')
            ->map(fn ($rows) => $rows->keyBy('module_exercise_id'));
    }

    /**
     * Confere se a aula pertence ao curso (direto ou por um módulo dele).
     * Para "material" aceita qualquer arquivo do curso ou dos seus módulos.
     */
    public function lessonBelongsTo(Course $course, string $type, int $id): bool
    {
        $moduleIds = $course->modules()->pluck('course_modules.id');

        return match ($type) {
            'video', 'material' => CourseMaterial::whereKey($id)
                ->where('type', $type === 'video' ? '=' : '!=', 'video')
                ->where(fn ($q) => $q
                    ->where(fn ($q) => $q->where('materialable_type', $course->getMorphClass())->where('materialable_id', $course->id))
                    ->orWhere(fn ($q) => $q->where('materialable_type', (new CourseModule)->getMorphClass())->whereIn('materialable_id', $moduleIds)))
                ->exists(),
            'exercise_set' => ExerciseSet::whereKey($id)
                ->where(fn ($q) => $q->where('course_id', $course->id)->orWhereIn('course_module_id', $moduleIds))
                ->exists(),
            'application' => $moduleIds->contains($id),
            default => false,
        };
    }

    private function video(CourseMaterial $v, string $token): array
    {
        return [
            'key' => "video:{$v->id}",
            'token' => $token,
            'type' => 'video',
            'id' => $v->id,
            'title' => $v->title,
            'subtitle' => $v->category ?: 'Vídeo',
            'duration_seconds' => $v->duration_minutes ? $v->duration_minutes * 60 : null,
        ];
    }

    private function sets(Collection $sets): Collection
    {
        return $sets->filter(fn (ExerciseSet $s) => $s->questions->isNotEmpty())->values()->map(fn (ExerciseSet $s) => [
            'key' => "exercise_set:{$s->id}",
            'token' => "set:{$s->id}",
            'type' => 'exercise_set',
            'id' => $s->id,
            'title' => $s->title,
            'subtitle' => $s->questions->count().' questão(ões)',
            'duration_seconds' => null,
            'question_ids' => $s->questions->pluck('id')->all(),
            'max_score' => (int) $s->questions->sum('points'),
        ]);
    }

    /** Mesma regra da tela do aluno: ordem definida pelo admin; itens fora dela vão para o fim. */
    private function ordered(Collection $items, ?array $outline): Collection
    {
        $rank = array_flip($outline ?? []);

        return $items->values()
            ->map(fn ($item, $i) => [$item, $rank[$item['token']] ?? PHP_INT_MAX, $i])
            ->sort(fn ($a, $b) => [$a[1], $a[2]] <=> [$b[1], $b[2]])
            ->map(fn ($x) => $x[0])
            ->values();
    }
}
