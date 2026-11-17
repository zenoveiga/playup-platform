<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exercícios passam a ter título e agrupar várias questões (module_exercises).
     * Um módulo ou curso livre pode ter vários exercícios.
     */
    public function up(): void
    {
        Schema::create('exercise_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_module_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::table('module_exercises', function (Blueprint $table) {
            $table->foreignId('exercise_set_id')->nullable()->after('course_id')->constrained()->cascadeOnDelete();
            // Configurações extras por tipo de questão (ex.: tolerância da resposta numérica).
            $table->json('settings')->nullable()->after('expected_answer');
        });

        // Questões existentes entram em um exercício "Exercícios" do seu módulo/curso.
        foreach (['course_module_id', 'course_id'] as $owner) {
            $ids = DB::table('module_exercises')->whereNotNull($owner)->whereNull('exercise_set_id')->distinct()->pluck($owner);
            foreach ($ids as $id) {
                $setId = DB::table('exercise_sets')->insertGetId([
                    $owner => $id,
                    'title' => 'Exercícios',
                    'position' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('module_exercises')->where($owner, $id)->whereNull('exercise_set_id')->update(['exercise_set_id' => $setId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('module_exercises', function (Blueprint $table) {
            $table->dropConstrainedForeignId('exercise_set_id');
            $table->dropColumn('settings');
        });
        Schema::dropIfExists('exercise_sets');
    }
};
