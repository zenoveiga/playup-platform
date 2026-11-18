<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseModule;
use App\Models\ExerciseAnswer;
use App\Models\LessonProgress;
use App\Services\CourseProgress;
use App\Models\ModuleExercise;
use App\Models\VideoNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Interações do aluno dentro do curso: respostas de exercícios e anotações nos vídeos. */
class LearningController extends Controller
{
    public function answer(Request $request, Course $course, ModuleExercise $exercise): JsonResponse
    {
        $this->ensureAccess($request, $course);
        abort_unless($exercise->belongsToCourse($course), 404);

        $count = count($exercise->options ?? []);
        $index = ['integer', 'min:0', 'max:'.max($count - 1, 0)];
        $rules = match ($exercise->type) {
            'single_choice' => ['answer' => ['required', ...$index]],
            'multiple_choice' => ['answer' => 'required|array|min:1', 'answer.*' => $index],
            'true_false' => ['answer' => 'required|in:true,false'],
            'statements' => ['answer' => "required|array|size:$count", 'answer.*' => 'required|in:true,false'],
            'fill_blanks' => ['answer' => 'required|array|size:'.count($exercise->blanks()), 'answer.*' => 'nullable|string|max:1000'],
            'matching' => ['answer' => "required|array|size:$count", 'answer.*' => ['required', ...$index]],
            'ordering' => ['answer' => "required|array|size:$count", 'answer.*' => ['required', 'distinct', ...$index]],
            'numeric' => ['answer' => ['required', 'string', 'max:50', 'regex:/^\s*-?[\d\s.]*[.,]?\d+\s*$/']],
            default => ['answer' => 'required|string|max:20000'],
        };
        $data = $request->validate($rules, [
            'answer.required' => 'Responda o exercício antes de enviar.',
            'answer.size' => 'Responda todos os itens antes de enviar.',
            'answer.*.required' => 'Responda todos os itens antes de enviar.',
            'answer.regex' => 'Informe um número válido.',
        ]);

        [$isCorrect, $score] = $exercise->grade($data['answer']);

        $answer = ExerciseAnswer::firstOrNew([
            'student_id' => $request->user()->id,
            'module_exercise_id' => $exercise->id,
        ]);
        $answer->fill([
            'course_id' => $course->id,
            'answer' => match ($exercise->type) {
                'multiple_choice' => collect($data['answer'])->map(fn ($v) => (int) $v)->unique()->sort()->values()->all(),
                'single_choice' => (int) $data['answer'],
                'matching', 'ordering' => collect($data['answer'])->map(fn ($v) => (int) $v)->values()->all(),
                'fill_blanks' => collect($data['answer'])->map(fn ($v) => (string) $v)->values()->all(),
                default => $data['answer'],
            },
            'is_correct' => $isCorrect,
            'score' => $score,
            'attempts' => $answer->exists ? $answer->attempts + 1 : 1,
            'answered_at' => now(),
        ])->save();

        return response()->json(self::answerPayload($answer, $exercise));
    }

    /**
     * Registra engajamento numa aula (chamado periodicamente pela tela do curso).
     * seconds = tempo ativo desde o último envio; watched = segundos do vídeo reproduzidos.
     */
    public function track(Request $request, Course $course, CourseProgress $progress): JsonResponse
    {
        $this->ensureAccess($request, $course);

        $data = $request->validate([
            'lesson_type' => ['required', Rule::in(LessonProgress::TYPES)],
            'lesson_id' => 'required|integer',
            'seconds' => 'nullable|integer|min:0|max:3600',
            'watched' => 'nullable|numeric|min:0|max:3600',
            'position' => 'nullable|numeric|min:0|max:86400',
            'duration' => 'nullable|numeric|min:0|max:86400',
            'open' => 'nullable|boolean',
            'complete' => 'nullable|boolean',
        ]);

        abort_unless($progress->lessonBelongsTo($course, $data['lesson_type'], $data['lesson_id']), 404);

        $row = LessonProgress::firstOrNew([
            'student_id' => $request->user()->id,
            'course_id' => $course->id,
            'lesson_type' => $data['lesson_type'],
            'lesson_id' => $data['lesson_id'],
        ]);

        // Limita cada envio ao tempo real decorrido desde o anterior (+ folga), contra envios inflados.
        $elapsed = $row->last_seen_at ? max(0, (int) $row->last_seen_at->diffInSeconds(now(), true)) + 5 : 60;
        $seconds = min((int) ($data['seconds'] ?? 0), $elapsed, 120);
        $watched = min((int) round($data['watched'] ?? 0), $elapsed * 2, 240); // vídeo pode estar em 2x

        $row->fill([
            'time_spent_seconds' => $row->time_spent_seconds + $seconds,
            'watched_seconds' => $row->watched_seconds + $watched,
            'views' => $row->views + ($request->boolean('open') ? 1 : 0),
            'first_seen_at' => $row->first_seen_at ?? now(),
            'last_seen_at' => now(),
        ]);
        if (! empty($data['duration'])) {
            $row->duration_seconds = (int) round($data['duration']);
        }
        if (isset($data['position'])) {
            $row->last_position_seconds = (int) round($data['position']);
        }

        if (! $row->completed_at) {
            $done = match ($data['lesson_type']) {
                'video' => $row->duration_seconds && $row->watched_seconds >= $row->duration_seconds * LessonProgress::VIDEO_COMPLETION,
                'application' => $request->boolean('complete'),
                'material' => $row->views > 0,
                default => false, // exercícios: concluídos quando todas as questões são respondidas
            };
            if ($done) {
                $row->completed_at = now();
            }
        }
        $row->save();
        \App\Models\StudyDay::add($request->user()->id, $course->id, $seconds);

        return response()->json([
            'key' => $row->key(),
            'completed' => (bool) $row->completed_at,
            'time_spent' => $row->time_spent_seconds,
            'watched' => $row->watched_seconds,
        ]);
    }

    public function storeNote(Request $request, Course $course): JsonResponse
    {
        $this->ensureAccess($request, $course);

        $data = $request->validate([
            'course_material_id' => ['required', 'integer', Rule::exists('course_materials', 'id')->where('type', 'video')],
            'timestamp_seconds' => 'required|integer|min:0|max:86400',
            'body' => 'required|string|max:5000',
        ], ['body.required' => 'Escreva a anotação.']);

        abort_unless($this->videoBelongsToCourse(CourseMaterial::find($data['course_material_id']), $course), 404);

        $note = VideoNote::create([...$data, 'student_id' => $request->user()->id, 'course_id' => $course->id]);

        return response()->json($note, 201);
    }

    public function updateNote(Request $request, VideoNote $note): JsonResponse
    {
        abort_unless($note->student_id === $request->user()->id, 404);

        $note->update($request->validate([
            'body' => 'required|string|max:5000',
            'timestamp_seconds' => 'sometimes|integer|min:0|max:86400',
        ]));

        return response()->json($note);
    }

    public function destroyNote(Request $request, VideoNote $note): JsonResponse
    {
        abort_unless($note->student_id === $request->user()->id, 404);
        $note->delete();

        return response()->json(['deleted' => true]);
    }

    /** Dados devolvidos ao aluno após responder (sem revelar o gabarito). */
    public static function answerPayload(ExerciseAnswer $answer, ModuleExercise $exercise): array
    {
        return [
            'exercise_id' => $exercise->id,
            'answer' => $answer->answer,
            'is_correct' => $answer->is_correct,
            'score' => $answer->score,
            'max_score' => $exercise->points,
            'attempts' => $answer->attempts,
            'answered_at' => $answer->answered_at->toDateTimeString(),
            'explanation' => $exercise->explanation,
        ];
    }

    private function ensureAccess(Request $request, Course $course): void
    {
        abort_unless($course->status === 'published' && $request->user()->hasAccessTo($course), 403, 'Você não tem acesso a este curso.');
    }

    private function videoBelongsToCourse(?CourseMaterial $video, Course $course): bool
    {
        if (! $video) {
            return false;
        }

        return match ($video->materialable_type) {
            Course::class => $video->materialable_id === $course->id,
            CourseModule::class => $course->modules()->whereKey($video->materialable_id)->exists(),
            default => false,
        };
    }
}
