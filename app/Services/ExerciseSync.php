<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\Validator;

/**
 * Regras, validação e gravação de exercícios — compartilhado entre módulos e cursos livres.
 */
class ExerciseSync
{
    public static function rules(): array
    {
        return [
            'exercises' => 'nullable|array',
            'exercises.*.type' => 'required|in:multiple_choice,true_false,short_answer,essay',
            'exercises.*.statement' => 'required|string|max:10000',
            'exercises.*.options' => 'nullable|array',
            'exercises.*.options.*.text' => 'required|string|max:1000',
            'exercises.*.options.*.correct' => 'nullable|boolean',
            'exercises.*.expected_answer' => 'nullable|string|max:5000',
            'exercises.*.points' => 'required|integer|min:0|max:1000',
            'exercises.*.explanation' => 'nullable|string|max:5000',
        ];
    }

    public static function attributeNames(): array
    {
        return [
            'exercises.*.statement' => 'enunciado',
            'exercises.*.options.*.text' => 'texto da alternativa',
            'exercises.*.points' => 'pontuação',
        ];
    }

    public static function validate(Validator $v, array $exercises): void
    {
        foreach ($exercises as $i => $exercise) {
            $n = $i + 1;
            switch ($exercise['type'] ?? null) {
                case 'multiple_choice':
                    $options = $exercise['options'] ?? [];
                    if (count($options) < 2) {
                        $v->errors()->add("exercises.$i.options", "Exercício $n: informe ao menos 2 alternativas.");
                    } elseif (! collect($options)->contains(fn ($o) => filter_var($o['correct'] ?? false, FILTER_VALIDATE_BOOLEAN))) {
                        $v->errors()->add("exercises.$i.options", "Exercício $n: marque a alternativa correta.");
                    }
                    break;
                case 'true_false':
                    if (! in_array($exercise['expected_answer'] ?? null, ['true', 'false'], true)) {
                        $v->errors()->add("exercises.$i.expected_answer", "Exercício $n: indique se a afirmação é verdadeira ou falsa.");
                    }
                    break;
            }
        }
    }

    /** Recria os exercícios na ordem enviada pelo formulário. */
    public function sync(HasMany $relation, array $exercises): void
    {
        $relation->delete();

        foreach (array_values($exercises) as $position => $exercise) {
            $type = $exercise['type'];
            $relation->create([
                'position' => $position,
                'type' => $type,
                'statement' => $exercise['statement'],
                'options' => $type === 'multiple_choice'
                    ? collect($exercise['options'] ?? [])->map(fn ($o) => [
                        'text' => $o['text'],
                        'correct' => filter_var($o['correct'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    ])->values()->all()
                    : null,
                'expected_answer' => in_array($type, ['true_false', 'short_answer', 'essay'], true)
                    ? ($exercise['expected_answer'] ?? null)
                    : null,
                'points' => $exercise['points'],
                'explanation' => $exercise['explanation'] ?? null,
            ]);
        }
    }
}
