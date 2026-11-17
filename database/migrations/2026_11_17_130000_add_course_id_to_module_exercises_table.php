<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exercícios passam a poder pertencer a um módulo OU diretamente a um curso livre.
     */
    public function up(): void
    {
        Schema::table('module_exercises', function (Blueprint $table) {
            $table->unsignedBigInteger('course_module_id')->nullable()->change();
            $table->foreignId('course_id')->nullable()->after('course_module_id')
                ->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('module_exercises', function (Blueprint $table) {
            $table->dropConstrainedForeignId('course_id');
        });
    }
};
