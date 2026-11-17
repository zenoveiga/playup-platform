<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Venda (transação) do licenciado para um aluno.
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // VND-000001
            $table->foreignId('licensee_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
            // pix, credit_card, debit_card, boleto, cash, bank_transfer
            $table->string('payment_method');
            $table->unsignedSmallInteger('installments')->default(1);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            // pending (aguardando pagamento), paid (paga), canceled (cancelada)
            $table->string('status')->default('pending');
            $table->date('access_starts_on'); // início do acesso aos cursos
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->string('cancel_reason', 500)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['licensee_id', 'status']);
        });

        // Cursos vendidos, com o preço aplicado e o tempo de acesso.
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->string('course_title'); // cópia do nome no momento da venda
            $table->foreignId('price_table_id')->nullable()->constrained()->nullOnDelete();
            // suggested, price_table, campaign, manual
            $table->string('price_source');
            $table->string('price_label')->nullable(); // ex.: "Black Friday · À vista"
            $table->decimal('list_price', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->unsignedInteger('access_days')->nullable(); // null = acesso vitalício
            $table->timestamps();
        });

        // Acesso do aluno ao curso (liberado quando a venda é paga).
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('licensee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('sale_item_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('active'); // active, canceled
            $table->timestamp('starts_at');
            $table->timestamp('expires_at')->nullable(); // null = vitalício
            $table->timestamps();
            $table->index(['student_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('sale_items');
        Schema::dropIfExists('sales');
    }
};
