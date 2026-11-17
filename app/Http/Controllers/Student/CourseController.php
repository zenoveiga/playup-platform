<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\ModuleExercise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** Área do aluno: cursos adquiridos, catálogo e conteúdo dos cursos. */
class CourseController extends Controller
{
    /** Meus cursos (aba padrão) ou cursos disponíveis. */
    public function index(Request $request, string $tab = 'meus-cursos'): Response
    {
        $student = $request->user();

        // Acesso mais recente/abrangente por curso.
        $enrollments = $student->enrollments()
            ->where('status', 'active')
            ->with('course')
            ->get()
            ->filter(fn (Enrollment $e) => $e->course)
            ->groupBy('course_id')
            ->map(fn ($group) => $group->sortByDesc(fn (Enrollment $e) => [
                $e->access_status === 'active' ? 2 : ($e->access_status === 'scheduled' ? 1 : 0),
                $e->expires_at?->timestamp ?? PHP_INT_MAX,
            ])->first());

        $myCourses = $enrollments->map(fn (Enrollment $e) => [
            ...$this->courseCard($e->course),
            'access_status' => $e->access_status,
            'starts_at' => $e->starts_at->toDateString(),
            'expires_at' => $e->expires_at?->toDateString(),
        ])->sortBy(fn ($c) => [$c['access_status'] !== 'active', $c['title']])->values();

        $available = Course::where('status', 'published')
            ->withCount(['modules', 'materials', 'exerciseSets as exercises_count'])
            ->orderBy('title')
            ->get()
            ->map(fn (Course $c) => [
                ...$this->courseCard($c),
                'owned' => $enrollments->has($c->id) && $enrollments[$c->id]->access_status === 'active',
            ]);

        return Inertia::render('Student/Courses', [
            'initialTab' => $tab,
            'myCourses' => $myCourses,
            'availableCourses' => $available,
        ]);
    }

    public function available(Request $request): Response
    {
        return $this->index($request, 'disponiveis');
    }

    /** Conteúdo do curso — só com acesso válido. */
    public function show(Request $request, Course $course): Response
    {
        $student = $request->user();
        abort_unless($course->status === 'published', 404);

        $enrollment = $student->enrollments()->active()->where('course_id', $course->id)
            ->orderByRaw('expires_at IS NULL DESC')->orderByDesc('expires_at')->first();

        abort_unless($enrollment, 403, 'Você não tem acesso a este curso.');

        $course->load([
            'modules' => fn ($q) => $q->with(['materials', 'exerciseSets.questions', 'exercises']),
            'materials',
            'exerciseSets.questions',
            'exercises',
        ]);

        return Inertia::render('Student/CourseView', [
            'course' => [
                ...$course->only(['id', 'title', 'slug', 'description', 'category', 'level', 'workload_hours', 'structure', 'cover_url']),
                'outline' => $course->outline ?? [],
                'modules' => $course->modules->map(fn ($m) => [
                    'id' => $m->id,
                    'title' => $m->title,
                    'description' => $m->description,
                    'objectives' => $m->objectives,
                    'application_minutes' => $m->application_minutes,
                    'application_instructions' => $m->application_instructions,
                    'outline' => $m->outline ?? [],
                    'videos' => $m->materials->where('slot', 'video')->values()->map(fn ($v) => $this->material($v)),
                    'support' => $m->materials->where('slot', 'support')->values()->map(fn ($v) => $this->material($v)),
                    'exercise_sets' => $this->exerciseSets($m),
                ]),
                'materials' => $course->materials->map(fn ($v) => $this->material($v)),
                'exercise_sets' => $this->exerciseSets($course),
            ],
            'access' => [
                'starts_at' => $enrollment->starts_at->toDateString(),
                'expires_at' => $enrollment->expires_at?->toDateString(),
            ],
            // Respostas já enviadas pelo aluno, por exercício.
            'answers' => (object) \App\Models\ExerciseAnswer::where('student_id', $student->id)
                ->where('course_id', $course->id)
                ->with('exercise')
                ->get()
                ->filter(fn ($a) => $a->exercise)
                ->mapWithKeys(fn ($a) => [$a->module_exercise_id => LearningController::answerPayload($a, $a->exercise)])
                ->all(),
            // Anotações do aluno nos vídeos deste curso.
            'notes' => \App\Models\VideoNote::where('student_id', $student->id)
                ->where('course_id', $course->id)
                ->orderBy('timestamp_seconds')
                ->get(['id', 'course_material_id', 'timestamp_seconds', 'body', 'updated_at']),
        ]);
    }

    private function courseCard(Course $c): array
    {
        return $c->only(['id', 'title', 'slug', 'description', 'category', 'level', 'workload_hours', 'structure', 'cover_url'])
            + ['modules_count' => $c->modules_count ?? $c->modules()->count()];
    }

    private function material($m): array
    {
        return [
            'id' => $m->id,
            'type' => $m->type,
            'category' => $m->category,
            'title' => $m->title,
            'description' => $m->description,
            'url' => $m->url,
            'file_url' => $m->file_url,
            'file_name' => $m->file_name,
            'mime_type' => $m->mime_type,
            'duration_minutes' => $m->duration_minutes,
        ];
    }

    /** Exercícios com suas questões, sem gabarito. Questões soltas (sem exercício) entram num grupo próprio. */
    private function exerciseSets(Course|CourseModule $owner): array
    {
        $sets = $owner->exerciseSets->map(fn ($set) => [
            'id' => $set->id,
            'title' => $set->title,
            'description' => $set->description,
            'questions' => $set->questions->map(fn (ModuleExercise $q) => $q->forStudent())->values(),
        ]);

        $loose = $owner->exercises->whereNull('exercise_set_id');
        if ($loose->isNotEmpty()) {
            $sets->push([
                'id' => 'loose-'.$owner->id,
                'title' => 'Exercícios',
                'description' => null,
                'questions' => $loose->map(fn (ModuleExercise $q) => $q->forStudent())->values(),
            ]);
        }

        return $sets->filter(fn ($s) => count($s['questions']) > 0)->values()->all();
    }
}
