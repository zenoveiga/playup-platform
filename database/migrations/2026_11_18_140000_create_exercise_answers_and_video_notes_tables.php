<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Resposta do aluno a um exercício (a última tentativa; tentativas são contadas).
        Schema::create('exercise_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('module_exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            // Múltipla escolha: índices marcados; V/F: "true"/"false"; demais: texto.
            $table->json('answer');
            // null = aguardando correção (dissertativa ou resposta curta sem gabarito).
            $table->boolean('is_correct')->nullable();
            $table->decimal('score', 8, 2)->nullable();
            $table->unsignedInteger('attempts')->default(1);
            $table->timestamp('answered_at');
            $table->timestamps();
            $table->unique(['student_id', 'module_exercise_id']);
        });

        // Anotações do aluno marcadas num instante do vídeo.
        Schema::create('video_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_material_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('timestamp_seconds');
            $table->text('body');
            $table->timestamps();
            $table->index(['student_id', 'course_material_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_notes');
        Schema::dropIfExists('exercise_answers');
    }
};
