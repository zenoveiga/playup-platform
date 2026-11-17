<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Vídeos do módulo deixam de ter posições fixas (conceito/exemplo/erros comuns)
     * e passam a ser uma lista livre, cada um com uma categoria escolhida pelo admin.
     */
    public function up(): void
    {
        Schema::table('course_materials', function (Blueprint $table) {
            $table->string('category', 60)->nullable()->after('slot');
        });

        $legacy = [
            'concept' => 'Conceito',
            'example' => 'Exemplo',
            'common_errors' => 'Erros comuns',
        ];

        foreach ($legacy as $slot => $label) {
            DB::table('course_materials')->where('slot', $slot)->update(['slot' => 'video', 'category' => $label]);
        }
    }

    public function down(): void
    {
        $legacy = [
            'Conceito' => 'concept',
            'Exemplo' => 'example',
            'Erros comuns' => 'common_errors',
        ];

        foreach ($legacy as $label => $slot) {
            DB::table('course_materials')->where('slot', 'video')->where('category', $label)->update(['slot' => $slot]);
        }

        Schema::table('course_materials', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
