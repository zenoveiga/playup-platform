<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * Questão de um exercício.
 *
 * Formato de `options` por tipo:
 *  - single_choice / multiple_choice: [{text, correct}]
 *  - statements (julgar V/F):         [{text, correct}]  (correct = afirmação verdadeira)
 *  - matching (associar colunas):     [{text, match}]    (text = coluna A, match = par na coluna B)
 *  - ordering (ordenar):              [{text}]           (na ordem correta)
 * fill_blanks usa marcadores no enunciado: "A capital é [[Brasília]]" ou "[[SP|São Paulo]]".
 * numeric usa expected_answer + settings.tolerance; short_answer aceita uma resposta por linha.
 */
class ModuleExercise extends Model
{
    public const TYPES = [
        'single_choice',
        'multiple_choice',
        'true_false',
        'statements',
        'fill_blanks',
        'matching',
        'ordering',
        'numeric',
        'short_answer',
        'essay',
    ];

    /** Tipos cujas alternativas/itens ficam em `options`. */
    public const OPTION_TYPES = ['single_choice', 'multiple_choice', 'statements', 'matching', 'ordering'];

    private const BLANK = '/\[\[(.+?)\]\]/u';

    protected $fillable = [
        'position',
        'type',
        'statement',
        'options',
        'expected_answer',
        'settings',
        'points',
        'explanation',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'settings' => 'array',
            'points' => 'integer',
        ];
    }

    /** Curso ao qual a questão pertence: o curso livre ou um curso que contém o módulo. */
    public function belongsToCourse(Course $course): bool
    {
        if ($this->course_id) {
            return $this->course_id === $course->id;
        }

        return $course->modules()->whereKey($this->course_module_id)->exists();
    }

    /**
     * Corrige a resposta. Devolve [is_correct, score]; is_correct null = aguarda correção manual.
     * Tipos com vários itens (afirmações, lacunas, associação) dão pontuação proporcional.
     *
     * @return array{0: bool|null, 1: float|null}
     */
    public function grade(mixed $answer): array
    {
        $options = $this->options ?? [];
        $answers = is_array($answer) ? array_values($answer) : [];

        $ratio = match ($this->type) {
            'single_choice' => is_numeric($answer) && ($options[(int) $answer]['correct'] ?? false) ? 1.0 : 0.0,
            'multiple_choice' => collect($options)->keys()->filter(fn ($i) => $options[$i]['correct'] ?? false)->values()->all()
                == collect((array) $answer)->map(fn ($v) => (int) $v)->unique()->sort()->values()->all() ? 1.0 : 0.0,
            'true_false' => $answer === $this->expected_answer ? 1.0 : 0.0,
            'statements' => $this->share(collect($options)->filter(
                fn ($o, $i) => ($answers[$i] ?? null) === (($o['correct'] ?? false) ? 'true' : 'false')
            )->count(), count($options)),
            'fill_blanks' => $this->share(collect($this->blanks())->filter(
                fn ($accepted, $i) => in_array(static::normalize((string) ($answers[$i] ?? '')), array_map(static::normalize(...), $accepted), true)
            )->count(), count($this->blanks())),
            'matching' => $this->gradeMatching($answers),
            'ordering' => collect($answers)->map(fn ($k) => $this->displayOrder()[(int) $k] ?? -1)->all() === range(0, count($options) - 1) ? 1.0 : 0.0,
            'numeric' => $this->gradeNumeric($answer),
            'short_answer' => filled($this->expected_answer)
                ? (in_array(static::normalize((string) $answer), array_map(static::normalize(...), $this->acceptedAnswers()), true) ? 1.0 : 0.0)
                : null,
            default => null, // dissertativa
        };

        if ($ratio === null) {
            return [null, null];
        }

        return [$ratio >= 1.0, round($this->points * $ratio, 2)];
    }

    /** Respostas aceitas da resposta curta (uma por linha). */
    public function acceptedAnswers(): array
    {
        return collect(preg_split('/\r?\n/', (string) $this->expected_answer))->map(fn ($a) => trim($a))->filter()->values()->all();
    }

    /** Lacunas do enunciado: para cada uma, a lista de respostas aceitas. */
    public function blanks(): array
    {
        preg_match_all(self::BLANK, (string) $this->statement, $matches);

        return collect($matches[1])
            ->map(fn ($m) => collect(explode('|', $m))->map(fn ($a) => trim($a))->filter()->values()->all())
            ->all();
    }

    /** Trechos de texto entre as lacunas (lacunas = trechos - 1). */
    public function segments(): array
    {
        return preg_split(self::BLANK, (string) $this->statement);
    }

    /**
     * Ordem em que os itens embaralhados são exibidos ao aluno (associação e ordenação).
     * displayOrder()[posição exibida] = índice original. Estável e imprevisível sem a APP_KEY.
     */
    public function displayOrder(): array
    {
        $n = count($this->options ?? []);
        if ($n === 0) {
            return [];
        }

        $order = range(0, $n - 1);
        $key = (string) config('app.key');
        usort($order, fn ($a, $b) => strcmp(hash_hmac('sha256', "{$this->id}:{$a}", $key), hash_hmac('sha256', "{$this->id}:{$b}", $key)));

        // Nunca exibe já na ordem correta.
        if ($n > 1 && $order === range(0, $n - 1)) {
            $order = [...array_slice($order, 1), $order[0]];
        }

        return $order;
    }

    /** Dados exibidos ao aluno, sem o gabarito. */
    public function forStudent(): array
    {
        $options = collect($this->options ?? []);
        $base = [
            'id' => $this->id,
            'type' => $this->type,
            'statement' => $this->statement,
            'points' => $this->points,
        ];

        return match ($this->type) {
            'single_choice', 'multiple_choice', 'statements' => $base + ['options' => $options->pluck('text')->values()],
            'matching' => $base + [
                'left' => $options->pluck('text')->values(),
                'right' => collect($this->displayOrder())->map(fn ($i) => $options[$i]['match'] ?? '')->values(),
            ],
            'ordering' => $base + ['items' => collect($this->displayOrder())->map(fn ($i) => $options[$i]['text'] ?? '')->values()],
            'fill_blanks' => [...$base, 'statement' => preg_replace(self::BLANK, '____', (string) $this->statement), 'segments' => $this->segments()],
            default => $base,
        };
    }

    private function gradeMatching(array $answers): float
    {
        $order = $this->displayOrder();
        $hits = 0;
        foreach (array_keys($this->options ?? []) as $i) {
            $shown = $answers[$i] ?? null;
            if (is_numeric($shown) && ($order[(int) $shown] ?? null) === $i) {
                $hits++;
            }
        }

        return $this->share($hits, count($this->options ?? []));
    }

    private function gradeNumeric(mixed $answer): float
    {
        $given = static::toNumber($answer);
        $expected = static::toNumber($this->expected_answer);
        if ($given === null || $expected === null) {
            return 0.0;
        }

        return abs($given - $expected) <= (float) ($this->settings['tolerance'] ?? 0) + 1e-9 ? 1.0 : 0.0;
    }

    private function share(int $hits, int $total): float
    {
        return $total > 0 ? $hits / $total : 0.0;
    }

    public static function toNumber(mixed $value): ?float
    {
        $value = str_replace([' ', ','], ['', '.'], trim((string) $value));

        return is_numeric($value) ? (float) $value : null;
    }

    private static function normalize(string $text): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/', ' ', Str::ascii($text))));
    }

    public function exerciseSet(): BelongsTo
    {
        return $this->belongsTo(ExerciseSet::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }

    /** Curso livre ao qual a questão pertence (quando não está em um módulo). */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
