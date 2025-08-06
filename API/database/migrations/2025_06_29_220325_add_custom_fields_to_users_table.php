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
            Schema::table('users', function (Blueprint $table) {
                // Adiciona as novas colunas depois da coluna 'email'
                $table->string('matricula')->unique()->after('email');
                $table->string('cpf')->unique()->after('matricula');
            });
        }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
