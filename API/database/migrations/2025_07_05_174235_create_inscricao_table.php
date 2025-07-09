<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// Dentro do arquivo ..._create_inscricao_table.php

    public function up(): void
    {
        Schema::create('inscricao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('evento_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['sorteado', 'em espera', 'anulado'])->default('inscrito');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscricao');
    }
};
