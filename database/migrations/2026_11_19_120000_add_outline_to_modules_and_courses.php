<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ordem das aulas definida pelo admin, ex.: ["set:4", "video:12", "application", "support"].
     * Vazio = ordem padrão (vídeos, aplicação, materiais, exercícios).
     */
    public function up(): void
    {
        Schema::table('course_modules', fn (Blueprint $table) => $table->json('outline')->nullable());
        Schema::table('courses', fn (Blueprint $table) => $table->json('outline')->nullable());
    }

    public function down(): void
    {
        Schema::table('course_modules', fn (Blueprint $table) => $table->dropColumn('outline'));
        Schema::table('courses', fn (Blueprint $table) => $table->dropColumn('outline'));
    }
};
