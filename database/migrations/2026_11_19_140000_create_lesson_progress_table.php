<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Progresso e engajamento do aluno em cada aula do curso.
     * lesson_type: video (course_materials.id), exercise_set (exercise_sets.id),
     * application (course_modules.id) ou material (course_materials.id, apostilas/arquivos/links).
     */
    public function up(): void
    {
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('lesson_type', 20);
            $table->unsignedBigInteger('lesson_id');
            // Tempo com a aula aberta e o aluno ativo na página.
            $table->unsignedInteger('time_spent_seconds')->default(0);
            // Vídeos: segundos do vídeo efetivamente reproduzidos (pulos não contam).
            $table->unsignedInteger('watched_seconds')->default(0);
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedInteger('last_position_seconds')->default(0);
            $table->unsignedInteger('views')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'course_id', 'lesson_type', 'lesson_id']);
            $table->index(['course_id', 'lesson_type', 'lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_progress');
    }
};
