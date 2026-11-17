<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabela de preços: sugerida pela plataforma (owner_id null) ou do licenciado.
        Schema::create('price_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('description', 500)->nullable();
            // Condição de pagamento da tabela (ex.: à vista = 1, parcelado em até 12x = 12).
            $table->unsignedSmallInteger('max_installments')->default(1);
            // Tabela padrão do licenciado (vale fora das campanhas).
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('price_table_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_table_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->timestamps();
            $table->unique(['price_table_id', 'course_id']);
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('licensee_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('starts_on');
            $table->date('ends_on');
            $table->timestamps();
        });

        // Tabelas oferecidas na campanha como opções de pagamento.
        Schema::create('campaign_price_table', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('price_table_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->unique(['campaign_id', 'price_table_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_price_table');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('price_table_items');
        Schema::dropIfExists('price_tables');
    }
};
