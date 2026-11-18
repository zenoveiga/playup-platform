<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * As categorias padrão dos vídeos mudaram em config/playup.php
 * ("Revisão" → "Aplicação", "Erros comuns" → "Erro comum").
 * Os vídeos já salvos com os nomes antigos faziam as duas versões aparecerem
 * nas sugestões do construtor de módulos; aqui eles passam a usar os nomes novos.
 */
return new class extends Migration
{
    private const RENAMES = [
        'revisão' => 'Aplicação',
        'revisao' => 'Aplicação',
        'erros comuns' => 'Erro comum',
    ];

    public function up(): void
    {
        foreach (self::RENAMES as $old => $new) {
            DB::table('course_materials')
                ->whereNotNull('category')
                ->whereRaw('LOWER(TRIM(category)) = ?', [$old])
                ->update(['category' => $new]);
        }
    }

    public function down(): void
    {
        // Sem volta: não dá para distinguir os vídeos que já eram "Aplicação" / "Erro comum".
    }
};
