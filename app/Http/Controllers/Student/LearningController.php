<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseModule;
use App\Models\ExerciseAnswer;
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

        $rules = match ($exercise->type) {
            'multiple_choice' => [
                'answer' => 'required|array|min:1',
                'answer.*' => ['integer', 'min:0', 'max:'.(count($exercise->options ?? []) - 1)],
            ],
            'true_false' => ['answer' => 'required|in:true,false'],
            default => ['answer' => 'required|string|max:20000'],
        };
        $data = $request->validate($rules, [
            'answer.required' => 'Responda o exercício antes de enviar.',
        ]);

        [$isCorrect, $score] = $exercise->grade($data['answer']);

        $answer = ExerciseAnswer::firstOrNew([
            'student_id' => $request->user()->id,
            'module_exercise_id' => $exercise->id,
        ]);
        $answer->fill([
            'course_id' => $course->id,
            'answer' => $exercise->type === 'multiple_choice'
                ? collect($data['answer'])->map(fn ($v) => (int) $v)->unique()->sort()->values()->all()
                : $data['answer'],
            'is_correct' => $isCorrect,
            'score' => $score,
            'attempts' => $answer->exists ? $answer->attempts + 1 : 1,
            'answered_at' => now(),
        ])->save();

        return response()->json(self::answerPayload($answer, $exercise));
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
