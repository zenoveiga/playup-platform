<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\ModuleExercise;
use Illuminate\Validation\Validator;

/**
 * Regras, validação e gravação dos exercícios (com título) e suas questões —
 * compartilhado entre módulos e cursos livres. Campo do formulário: exercise_sets.
 */
class ExerciseSync
{
    private const Q = 'exercise_sets.*.questions.*';

    public static function rules(): array
    {
        return [
            'exercise_sets' => 'nullable|array',
            'exercise_sets.*.id' => 'nullable|integer',
            'exercise_sets.*.title' => 'required|string|max:255',
            'exercise_sets.*.description' => 'nullable|string|max:5000',
            'exercise_sets.*.questions' => 'nullable|array',
            self::Q.'.id' => 'nullable|integer',
            self::Q.'.type' => 'required|in:'.implode(',', ModuleExercise::TYPES),
            self::Q.'.statement' => 'required|string|max:10000',
            self::Q.'.options' => 'nullable|array|max:20',
            self::Q.'.options.*.text' => 'required|string|max:1000',
            self::Q.'.options.*.correct' => 'nullable|boolean',
            self::Q.'.options.*.match' => 'nullable|string|max:1000',
            self::Q.'.expected_answer' => 'nullable|string|max:5000',
            self::Q.'.tolerance' => 'nullable|numeric|min:0',
            self::Q.'.points' => 'required|integer|min:0|max:1000',
            self::Q.'.explanation' => 'nullable|string|max:5000',
        ];
    }

    public static function attributeNames(): array
    {
        return [
            'exercise_sets.*.title' => 'título do exercício',
            self::Q.'.statement' => 'enunciado',
            self::Q.'.options.*.text' => 'texto da alternativa',
            self::Q.'.points' => 'pontuação',
            self::Q.'.tolerance' => 'tolerância',
        ];
    }

    public static function validate(Validator $v, array $sets): void
    {
        foreach (array_values($sets) as $s => $set) {
            $label = 'Exercício "'.(($set['title'] ?? '') ?: $s + 1).'"';
            $questions = $set['questions'] ?? [];

            if (empty($questions)) {
                $v->errors()->add("exercise_sets.$s.questions", "$label: adicione ao menos uma questão.");
            }

            foreach (array_values($questions) as $q => $question) {
                $key = "exercise_sets.$s.questions.$q";
                $n = "$label, questão ".($q + 1);
                $options = $question['options'] ?? [];
                $correct = collect($options)->filter(fn ($o) => filter_var($o['correct'] ?? false, FILTER_VALIDATE_BOOLEAN))->count();

                $error = match ($question['type'] ?? null) {
                    'single_choice' => count($options) < 2 ? 'informe ao menos 2 alternativas.'
                        : ($correct !== 1 ? 'marque exatamente uma alternativa correta.' : null),
                    'multiple_choice' => count($options) < 2 ? 'informe ao menos 2 alternativas.'
                        : ($correct < 1 ? 'marque ao menos uma alternativa correta.' : null),
                    'statements' => count($options) < 1 ? 'adicione ao menos uma afirmação.' : null,
                    'matching' => count($options) < 2 ? 'informe ao menos 2 pares.'
                        : (collect($options)->contains(fn ($o) => blank($o['match'] ?? null)) ? 'preencha os dois lados de cada par.' : null),
                    'ordering' => count($options) < 2 ? 'informe ao menos 2 itens.' : null,
                    default => null,
                };
                if ($error) {
                    $v->errors()->add("$key.options", "$n: $error");
                }

                match ($question['type'] ?? null) {
                    'true_false' => in_array($question['expected_answer'] ?? null, ['true', 'false'], true)
                        ?: $v->errors()->add("$key.expected_answer", "$n: indique se a afirmação é verdadeira ou falsa."),
                    'numeric' => ModuleExercise::toNumber($question['expected_answer'] ?? '') !== null
                        ?: $v->errors()->add("$key.expected_answer", "$n: informe a resposta numérica correta."),
                    'fill_blanks' => preg_match('/\[\[\s*[^\]\s][^\]]*\]\]/u', (string) ($question['statement'] ?? ''))
                        ?: $v->errors()->add("$key.statement", "$n: marque ao menos uma lacuna com [[resposta]]."),
                    default => null,
                };
            }
        }
    }

    /**
     * Grava os exercícios e questões na ordem do formulário. Itens com id são atualizados
     * (as respostas dos alunos são preservadas); os ausentes são removidos.
     */
    public function sync(Course|CourseModule $owner, array $sets): void
    {
        $keepSets = [];
        $keepQuestions = [];

        foreach (array_values($sets) as $setPosition => $setData) {
            $set = filled($setData['id'] ?? null) ? $owner->exerciseSets()->find($setData['id']) : null;
            $set ??= $owner->exerciseSets()->make();
            $set->fill([
                'title' => $setData['title'],
                'description' => $setData['description'] ?? null,
                'position' => $setPosition,
            ])->save();
            $keepSets[] = $set->id;

            foreach (array_values($setData['questions'] ?? []) as $position => $data) {
                $question = filled($data['id'] ?? null) ? $owner->exercises()->find($data['id']) : null;
                $question ??= $owner->exercises()->make();
                $question->exercise_set_id = $set->id;
                $question->fill(static::attributes($data, $position))->save();
                $keepQuestions[] = $question->id;
            }
        }

        $owner->exercises()->whereNotIn('id', $keepQuestions)->delete();
        $owner->exerciseSets()->whereNotIn('id', $keepSets)->delete();
    }

    private static function attributes(array $data, int $position): array
    {
        $type = $data['type'];

        return [
            'position' => $position,
            'type' => $type,
            'statement' => $data['statement'],
            'options' => in_array($type, ModuleExercise::OPTION_TYPES, true)
                ? collect($data['options'] ?? [])->map(fn ($o) => match ($type) {
                    'matching' => ['text' => $o['text'], 'match' => $o['match'] ?? ''],
                    'ordering' => ['text' => $o['text']],
                    default => ['text' => $o['text'], 'correct' => filter_var($o['correct'] ?? false, FILTER_VALIDATE_BOOLEAN)],
                })->values()->all()
                : null,
            'expected_answer' => in_array($type, ['true_false', 'short_answer', 'essay', 'numeric'], true)
                ? ($data['expected_answer'] ?? null)
                : null,
            'settings' => $type === 'numeric' ? ['tolerance' => (float) ($data['tolerance'] ?? 0)] : null,
            'points' => $data['points'],
            'explanation' => $data['explanation'] ?? null,
        ];
    }
}
