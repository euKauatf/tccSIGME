<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('tema');
            $table->integer('vagas_max');
            $table->string('data');
            $table->time('horario_inicio');
            $table->time('horario_termino');
            $table->text('descricao');
            $table->string('local');
            $table->foreignId('palestrante_id')
                  ->nullable()
                  ->constrained('palestrantes')
                  ->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
