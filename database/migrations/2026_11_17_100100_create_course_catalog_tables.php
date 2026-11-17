<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Biblioteca de módulos: cada módulo pode compor um ou mais cursos.
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            // Bloco "Aplicação" (prática guiada, ~10 minutos).
            $table->unsignedSmallInteger('application_minutes')->default(10);
            $table->text('application_instructions')->nullable();
            $table->string('status')->default('draft'); // draft, published
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('level')->default('iniciante'); // iniciante, intermediario, avancado
            $table->unsignedSmallInteger('workload_hours')->nullable();
            $table->string('cover_path')->nullable();
            // modular = compilado de módulos; free = materiais avulsos, sem módulos.
            $table->string('structure')->default('modular');
            $table->string('status')->default('draft'); // draft, published
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('course_course_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_module_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->unique(['course_id', 'course_module_id']);
        });

        // Materiais (vídeos, apostilas, links, arquivos) de um módulo OU de um curso livre.
        Schema::create('course_materials', function (Blueprint $table) {
            $table->id();
            $table->morphs('materialable');
            // Para módulos: concept, example, common_errors (vídeos fixos) ou support (apoio).
            // Para cursos livres: null.
            $table->string('slot')->nullable();
            $table->string('type'); // video, document, link, file
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('url', 1000)->nullable();
            $table->unsignedSmallInteger('duration_minutes')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('module_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_module_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            // multiple_choice, true_false, short_answer, essay
            $table->string('type');
            $table->text('statement');
            $table->json('options')->nullable(); // [{text, correct}]
            $table->text('expected_answer')->nullable();
            $table->unsignedSmallInteger('points')->default(1);
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_exercises');
        Schema::dropIfExists('course_materials');
        Schema::dropIfExists('course_course_module');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('course_modules');
    }
};
