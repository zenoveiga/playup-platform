<?php

namespace App\Support;

/**
 * Nome canônico das categorias de vídeo. Variações de escrita ou nomes antigos
 * (config playup.video_category_aliases) viram a categoria padrão correspondente,
 * para que a mesma categoria não apareça duas vezes no construtor de módulos.
 */
class VideoCategory
{
    public static function normalize(?string $category): ?string
    {
        if ($category === null) {
            return null;
        }

        $category = trim(preg_replace('/\s+/u', ' ', $category));
        $key = mb_strtolower($category);

        foreach (config('playup.video_categories', []) as $default) {
            if (mb_strtolower($default) === $key) {
                return $default;
            }
        }

        foreach (config('playup.video_category_aliases', []) as $alias => $canonical) {
            if (mb_strtolower($alias) === $key) {
                return $canonical;
            }
        }

        return $category;
    }
}
