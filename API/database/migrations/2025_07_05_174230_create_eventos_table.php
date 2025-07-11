<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// Dentro do arquivo ..._create_eventos_table.php

    public function up(): void
    {
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

    // E preencha o método down() para poder reverter
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
