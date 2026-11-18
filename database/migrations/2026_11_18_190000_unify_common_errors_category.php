<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Unifica as variações da categoria de vídeo "Erros Comuns" que ficaram salvas
 * ("Erro comum", "Erros comuns", "Errors Comuns"...) em um único nome.
 */
return new class extends Migration
{
    private const NAME = 'Erros Comuns';

    private const VARIANTS = ['erro comum', 'erros comuns', 'errors comuns', 'error comum', 'errors comum', 'erros comum', 'erro comuns'];

    public function up(): void
    {
        DB::table('course_materials')
            ->whereNotNull('category')
            ->whereIn(DB::raw('LOWER(TRIM(category))'), self::VARIANTS)
            ->update(['category' => self::NAME]);
    }

    public function down(): void
    {
        // Sem volta: as variações originais não são guardadas.
    }
};
