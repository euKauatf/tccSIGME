<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cria a tabela com o nome 'event' (singular)
        Schema::create('event', function (Blueprint $table) {
            $table->id();
            $table->string('tema');
            $table->string('palestrante');
            $table->integer('vagas_max');
            $table->dateTime('horario_inicio');
            $table->dateTime('horario_termino');
            $table->text('descricao');
            $table->string('local');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // CORRIGIDO: Garante que o método down apaga a tabela correta ('event')
        Schema::dropIfExists('event');
    }
};
