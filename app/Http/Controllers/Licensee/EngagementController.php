<?php

namespace App\Http\Controllers\Licensee;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use App\Services\CourseProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/** Progresso e engajamento dos alunos do licenciado, por curso e por aula. */
class EngagementController extends Controller
{
    public function __construct(private CourseProgress $progress) {}

    public function index(Request $request): Response
    {
        $licensee = $request->user();
        $studentIds = $licensee->students()->pluck('id')->all();

        // Matrícula mais recente de cada aluno em cada curso (alunos do licenciado ou vendas dele).
        $enrollments = Enrollment::where(fn ($q) => $q->whereIn('student_id', $studentIds)->orWhere('licensee_id', $licensee->id))
            ->where('status', '!=', 'canceled')
            ->with('student:id,name,email')
            ->orderByDesc('starts_at')
            ->get()
            ->unique(fn ($e) => $e->course_id.'-'.$e->student_id)
            ->groupBy('course_id');

        $courses = Course::whereIn('id', $enrollments->keys())->orderBy('title')->get();

        $summaries = $courses->map(function (Course $course) use ($enrollments) {
            $ids = $enrollments[$course->id]->pluck('student_id')->all();
            $status = $this->progress->forStudents($course, $ids);

            return [
                'id' => $course->id,
                'title' => $course->title,
                'cover_url' => $course->cover_url,
                'students' => count($ids),
                'started' => $status->where('time_spent', '>', 0)->count(),
                'finished' => $status->where('percent', 100)->count(),
                'avg_percent' => (int) round($status->avg('percent') ?? 0),
                'time_spent' => $status->sum('time_spent'),
            ];
        })->values();

        $selected = $courses->firstWhere('id', $request->integer('curso')) ?? $courses->first();

        return Inertia::render('Licensee/Engagement/Index', [
            'courses' => $summaries,
            'selected' => $selected ? $this->courseReport($selected, $enrollments[$selected->id]) : null,
        ]);
    }

    public function student(Request $request, Course $course, User $student): Response
    {
        $licensee = $request->user();
        $enrollment = Enrollment::where('student_id', $student->id)->where('course_id', $course->id)->latest('starts_at')->first();
        abort_unless(
            $student->role === 'student' && $enrollment && ($student->licensee_id === $licensee->id || $enrollment->licensee_id === $licensee->id),
            404
        );

        $lessons = $this->progress->lessons($course);
        $status = $this->progress->forStudent($course, $student, $lessons);

        $materials = LessonProgress::where('student_id', $student->id)->where('course_id', $course->id)->where('lesson_type', 'material')->get();
        $materialTitles = \App\Models\CourseMaterial::whereIn('id', $materials->pluck('lesson_id'))->pluck('title', 'id');

        return Inertia::render('Licensee/Engagement/Student', [
            'course' => $course->only(['id', 'title', 'cover_url']),
            'student' => $student->only(['id', 'name', 'email', 'phone']),
            'access' => ['status' => $enrollment->access_status, 'starts_at' => $enrollment->starts_at->toDateString(), 'expires_at' => $enrollment->expires_at?->toDateString()],
            'summary' => collect($status)->except('lessons'),
            'lessons' => $lessons->map(fn ($l) => [
                ...collect($l)->only(['key', 'type', 'title', 'subtitle', 'module_title']),
                ...$status['lessons'][$l['key']],
            ])->values(),
            'materials' => $materials->map(fn ($m) => [
                'title' => $materialTitles[$m->lesson_id] ?? 'Material removido',
                'views' => $m->views,
                'last_seen_at' => $m->last_seen_at?->toDateTimeString(),
            ])->values(),
        ]);
    }

    /** Detalhe de um curso: alunos e engajamento em cada aula. */
    private function courseReport(Course $course, Collection $enrollments): array
    {
        $ids = $enrollments->pluck('student_id')->all();
        $lessons = $this->progress->lessons($course);
        $status = $this->progress->forStudents($course, $ids, $lessons);
        $total = max(count($ids), 1);

        return [
            'course' => $course->only(['id', 'title', 'cover_url']),
            'students' => $enrollments->map(fn (Enrollment $e) => [
                'id' => $e->student_id,
                'name' => $e->student?->name,
                'email' => $e->student?->email,
                'access_status' => $e->access_status,
                ...collect($status[$e->student_id])->except('lessons'),
            ])->sortByDesc('percent')->values(),
            'lessons' => $lessons->map(function ($l) use ($status, $total) {
                $per = $status->map(fn ($s) => $s['lessons'][$l['key']]);
                $viewers = $per->filter(fn ($p) => $p['time_spent'] > 0 || $p['views'] > 0 || ($p['answered'] ?? 0) > 0);

                return [
                    ...collect($l)->only(['key', 'type', 'title', 'subtitle', 'module_title']),
                    'viewers' => $viewers->count(),
                    'completed' => $per->where('completed', true)->count(),
                    'completion_rate' => (int) round($per->where('completed', true)->count() / $total * 100),
                    'avg_time' => (int) round($viewers->avg('time_spent') ?? 0),
                    'total_time' => $per->sum('time_spent'),
                    'avg_watched_pct' => $l['type'] === 'video' ? (int) round($viewers->avg('watched_pct') ?? 0) : null,
                    'avg_score_pct' => $l['type'] === 'exercise_set' && $l['max_score']
                        ? (int) round(($viewers->avg('score') ?? 0) / $l['max_score'] * 100)
                        : null,
                ];
            })->values(),
        ];
    }
}
