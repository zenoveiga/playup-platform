<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Controle de acesso: vínculo aluno → licenciado, aprovação e bloqueio.
     *
     * status passa a aceitar: active, inactive, pending (aguardando aprovação), blocked.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('licensee_id')->nullable()->after('role')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('status');
            $table->foreignId('approved_by')->nullable()->after('approved_at')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('blocked_at')->nullable()->after('approved_by');
            $table->string('blocked_reason', 500)->nullable()->after('blocked_at');
            // Licenciado: o bloqueio foi estendido aos alunos?
            $table->boolean('block_extends_to_students')->default(false)->after('blocked_reason');
            // Aluno: bloqueado em cascata pelo bloqueio do licenciado (para reverter no desbloqueio).
            $table->boolean('blocked_via_licensee')->default(false)->after('block_extends_to_students');
            // Status anterior ao bloqueio, restaurado no desbloqueio.
            $table->string('status_before_block')->nullable()->after('blocked_via_licensee');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('licensee_id');
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn([
                'approved_at',
                'blocked_at',
                'blocked_reason',
                'block_extends_to_students',
                'blocked_via_licensee',
                'status_before_block',
            ]);
        });
    }
};
