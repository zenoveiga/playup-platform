<?php

namespace App\Support;

/**
 * Ordem das aulas de um módulo ou curso livre.
 *
 * O formulário envia tokens por índice ("video:0", "set:1", "material:2", "application", "support"),
 * porque itens novos ainda não têm id. Depois de gravar, os índices viram ids ("video:12").
 */
class Outline
{
    public const FIXED = ['application', 'support'];

    public static function rules(): array
    {
        return [
            'outline' => 'nullable|array|max:500',
            'outline.*' => ['string', 'max:40', 'regex:/^(application|support|(video|set|material):\d+)$/'],
        ];
    }

    /**
     * @param  array<int, string>  $tokens  tokens por índice vindos do formulário
     * @param  array<string, array<int, int>>  $ids  ids gravados por tipo, na ordem enviada
     * @return array<int, string>|null
     */
    public static function resolve(?array $tokens, array $ids): ?array
    {
        if (empty($tokens)) {
            return null;
        }

        return collect($tokens)
            ->map(function ($token) use ($ids) {
                if (in_array($token, self::FIXED, true)) {
                    return $token;
                }
                [$type, $index] = explode(':', $token);
                $id = $ids[$type][(int) $index] ?? null;

                return $id ? "$type:$id" : null;
            })
            ->filter()
            ->unique()
            ->values()
            ->all() ?: null;
    }
}
