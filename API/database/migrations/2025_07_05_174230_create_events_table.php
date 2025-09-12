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
      $table->text('tema');
      $table->text('palestrante');
      $table->string('email_palestrante')->nullable();
      $table->string('telefone_palestrante')->nullable();
      $table->integer('vagas_max');
      $table->string('data');
      $table->time('horario_inicio');
      $table->time('horario_termino');
      $table->text('descricao');
      $table->string('local')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('events');
  }
};
