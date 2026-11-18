<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\ExerciseAnswer;
use App\Models\LessonProgress;
use App\Models\StudyDay;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Estatísticas pedagógicas de um aluno: engajamento, ritmo por curso e boletim de exercícios.
 * Usado na aba Pedagógico do perfil do aluno (painel do licenciado).
 */
class StudentInsights
{
    /** Dias sem acessar para entrar em "atenção" e em "risco". */
    public const ATTENTION_DAYS = 7;
    public const RISK_DAYS = 14;

    /** Pontos percentuais abaixo do esperado para considerar "abaixo do ritmo". */
    public const BEHIND_MARGIN = 15;

    public function __construct(private CourseProgress $progress) {}

    public function for(User $student): array
    {
        $enrollments = Enrollment::where('student_id', $student->id)
            ->where('status', '!=', 'canceled')
            ->with('course')
            ->orderByDesc('starts_at')
            ->get()
            ->filter(fn (Enrollment $e) => $e->course)
            ->unique('course_id')
            ->values();

        $answers = ExerciseAnswer::where('student_id', $student->id)->with('exercise:id,points')->get()->keyBy('module_exercise_id');

        $courses = $enrollments->map(fn (Enrollment $e) => $this->course($e, $student, $answers))->values();

        $lastSeen = LessonProgress::where('student_id', $student->id)->max('last_seen_at');
        $lastSeen = $lastSeen ? \Illuminate\Support\Carbon::parse($lastSeen) : null;

        $daily = $this->daily($student);
        $graded = $answers->whereNotNull('is_correct');
        $gradedMax = $graded->sum(fn ($a) => $a->exercise?->points ?? 0);
        $watched = $courses->pluck('videos_watched_pct')->filter(fn ($v) => $v !== null);

        $overview = [
            'percent' => $courses->isNotEmpty() ? (int) round($courses->avg('percent')) : 0,
            'completed' => $courses->sum('completed'),
            'total' => $courses->sum('total'),
            'time_7d' => $daily->slice(-7)->sum('seconds'),
            'time_30d' => $daily->sum('seconds'),
            'time_total' => $courses->sum('time_spent'),
            'active_days_30d' => $daily->where('seconds', '>', 0)->count(),
            'streak' => $this->streak($daily),
            'last_seen_at' => $lastSeen?->toDateTimeString(),
            'days_since_access' => $lastSeen ? (int) $lastSeen->copy()->startOfDay()->diffInDays(now()->startOfDay()) : null,
            'score_pct' => $gradedMax > 0 ? (int) round($graded->sum('score') / $gradedMax * 100) : null,
            'answered' => $answers->count(),
            'videos_watched_pct' => $watched->isNotEmpty() ? (int) round($watched->avg()) : null,
        ];

        return [
            'overview' => $overview,
            'status' => $this->status($overview, $courses, $enrollments),
            'daily' => $daily->values(),
            'courses' => $courses,
        ];
    }

    /** Progresso, ritmo e boletim de um curso. */
    private function course(Enrollment $e, User $student, Collection $answers): array
    {
        $course = $e->course;
        $lessons = $this->progress->lessons($course);
        $status = $this->progress->forStudent($course, $student, $lessons);
        $pace = $this->pace($e, $status['percent']);

        $videos = collect($status['lessons'])->filter(fn ($l, $key) => str_starts_with($key, 'video:') && ($l['watched'] ?? 0) > 0);

        return [
            'id' => $course->id,
            'title' => $course->title,
            'access_status' => $e->access_status,
            'starts_at' => $e->starts_at->toDateString(),
            'expires_at' => $e->expires_at?->toDateString(),
            'percent' => $status['percent'],
            'completed' => $status['completed'],
            'total' => $status['total'],
            'time_spent' => $status['time_spent'],
            'last_seen_at' => $status['last_seen_at'],
            'videos_watched_pct' => $videos->isNotEmpty() ? (int) round($videos->avg('watched_pct')) : null,
            ...$pace,
            'report' => $this->report($lessons, $answers),
        ];
    }

    /**
     * Ritmo: quanto do período de acesso já passou x quanto do curso foi concluído,
     * e quando o aluno termina se mantiver a velocidade atual.
     */
    private function pace(Enrollment $e, int $percent): array
    {
        $start = $e->starts_at;
        $end = $e->expires_at;
        $elapsed = max(0, $start->diffInDays(now(), false));
        $total = $end ? max(1, $start->diffInDays($end)) : null;

        $expected = ($total && $e->access_status === 'active') ? (int) min(100, round($elapsed / $total * 100)) : null;

        $projected = null;
        if ($percent > 0 && $percent < 100 && $elapsed >= 1) {
            $perDay = $percent / $elapsed;
            $projected = now()->addDays((int) ceil((100 - $percent) / $perDay));
        }

        $active = $e->access_status === 'active' && $percent < 100;

        return [
            'expected_percent' => $expected,
            'projected_end' => $projected?->toDateString(),
            'behind' => $active && $expected !== null && $percent < $expected - self::BEHIND_MARGIN,
            // Não termina antes do fim do acesso: pela projeção ou porque já passou 1/4 do prazo sem progresso.
            'will_miss' => $active && $end && (
                ($projected && $projected->gt($end)) || (! $projected && $percent === 0 && $expected !== null && $expected >= 25)
            ),
        ];
    }

    /** Boletim: cada exercício do curso, com acertos, pontos, tentativas e correções pendentes. */
    private function report(Collection $lessons, Collection $answers): array
    {
        $rows = $lessons->where('type', 'exercise_set')->map(function ($l) use ($answers) {
            $given = collect($l['question_ids'])->map(fn ($id) => $answers->get($id))->filter();
            $graded = $given->whereNotNull('is_correct');

            return [
                'key' => $l['key'],
                'title' => $l['title'],
                'module_title' => $l['module_title'],
                'questions' => count($l['question_ids']),
                'answered' => $given->count(),
                'correct' => $given->where('is_correct', true)->count(),
                'pending' => $given->whereNull('is_correct')->count(),
                'score' => round((float) $graded->sum('score'), 2),
                'max_score' => $l['max_score'],
                'score_pct' => $l['max_score'] && $given->isNotEmpty() ? (int) round($graded->sum('score') / $l['max_score'] * 100) : null,
                'attempts' => $given->isNotEmpty() ? round($given->avg('attempts'), 1) : null,
                'last_answer_at' => $given->max('answered_at')?->toDateTimeString(),
            ];
        })->values();

        $max = $rows->sum('max_score');

        return [
            'rows' => $rows,
            'score' => round($rows->sum('score'), 2),
            'max_score' => $max,
            'score_pct' => $max && $rows->sum('answered') ? (int) round($rows->sum('score') / $max * 100) : null,
            'answered' => $rows->sum('answered'),
            'questions' => $rows->sum('questions'),
            'pending' => $rows->sum('pending'),
        ];
    }

    /** Situação do aluno (engajado / atenção / risco) com os motivos. */
    private function status(array $o, Collection $courses, Collection $enrollments): array
    {
        $active = $courses->where('access_status', 'active');
        if ($active->isEmpty()) {
            return ['level' => 'none', 'label' => 'Sem curso ativo', 'reasons' => []];
        }

        $reasons = [];
        $level = 'engaged';
        $raise = function (string $to) use (&$level) {
            $rank = ['engaged' => 0, 'attention' => 1, 'risk' => 2];
            if ($rank[$to] > $rank[$level]) {
                $level = $to;
            }
        };

        // Dias sem acessar (ou desde o início do acesso, se nunca entrou).
        $since = $o['days_since_access'];
        if ($since === null) {
            $start = $enrollments->where('access_status', 'active')->min('starts_at');
            $days = $start ? (int) $start->copy()->startOfDay()->diffInDays(now()->startOfDay()) : 0;
            if ($days > self::RISK_DAYS) {
                $raise('risk');
            } elseif ($days > self::ATTENTION_DAYS) {
                $raise('attention');
            }
            $reasons[] = $days > 0 ? "Ainda não acessou o curso ({$days} dia(s) desde a liberação)" : 'Ainda não acessou o curso';
        } elseif ($since > self::RISK_DAYS) {
            $raise('risk');
            $reasons[] = "{$since} dias sem acessar";
        } elseif ($since > self::ATTENTION_DAYS) {
            $raise('attention');
            $reasons[] = "{$since} dias sem acessar";
        }

        foreach ($active as $c) {
            if ($c['will_miss']) {
                $raise('risk');
                $reasons[] = $c['projected_end']
                    ? "{$c['title']}: no ritmo atual termina em ".$this->br($c['projected_end']).', depois do fim do acesso ('.$this->br($c['expires_at']).')'
                    : "{$c['title']}: já passou {$c['expected_percent']}% do prazo sem progresso";
            } elseif ($c['behind']) {
                $raise('attention');
                $reasons[] = "{$c['title']}: {$c['percent']}% concluído, esperado ~{$c['expected_percent']}%";
            }
        }

        if ($o['score_pct'] !== null && $o['score_pct'] < 50 && $o['answered'] >= 3) {
            $raise('attention');
            $reasons[] = "Acerto baixo nos exercícios ({$o['score_pct']}%)";
        }

        if ($level === 'engaged') {
            $reasons[] = $o['time_7d'] > 0 ? 'Estudou nos últimos 7 dias e está no ritmo' : 'Dentro do ritmo esperado';
        }

        $labels = ['engaged' => 'Engajado', 'attention' => 'Atenção', 'risk' => 'Em risco'];

        return ['level' => $level, 'label' => $labels[$level], 'reasons' => $reasons];
    }

    /** Minutos estudados em cada um dos últimos 30 dias (todos os cursos). */
    private function daily(User $student): Collection
    {
        $from = now()->subDays(29)->startOfDay();
        $byDate = StudyDay::where('student_id', $student->id)
            ->whereDate('date', '>=', $from->toDateString())
            ->get()
            ->groupBy(fn ($d) => $d->date->toDateString())
            ->map(fn ($g) => $g->sum('seconds'));

        return collect(range(0, 29))->map(function ($i) use ($from, $byDate) {
            $date = $from->copy()->addDays($i)->toDateString();

            return ['date' => $date, 'seconds' => (int) ($byDate[$date] ?? 0)];
        });
    }

    /** Dias seguidos com estudo, terminando hoje ou ontem. */
    private function streak(Collection $daily): int
    {
        $days = $daily->reverse()->values();
        if (($days[0]['seconds'] ?? 0) === 0) {
            $days = $days->slice(1)->values(); // hoje ainda sem estudo não quebra a sequência
        }
        $streak = 0;
        foreach ($days as $d) {
            if ($d['seconds'] <= 0) {
                break;
            }
            $streak++;
        }

        return $streak;
    }

    private function br(?string $date): string
    {
        return $date ? \Illuminate\Support\Carbon::parse($date)->format('d/m/Y') : '';
    }
}
