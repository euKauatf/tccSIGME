<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event; // Importe o modelo Event
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Importe o Hash
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        set_time_limit(0);

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        User::truncate();
        Event::truncate();
        DB::table('inscricoes')->truncate();
        \Illuminate\Support\Facades\DB::table('inscricoes')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();


        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'), 
            'tipo' => 'adm',
        ]);
        $alunos = User::factory(500)->create();

        $eventos = Event::factory(50)->create();

        $alunosParaInscrever = $alunos->take(300);

        $inscricoesParaFazer = [];

        foreach ($eventos as $evento) {            
            foreach($alunosParaInscrever as $aluno){
                $inscricoesParaFazer[] = [
                    'user_id' => $aluno->id,
                    'events_id' => $evento->id,
                    'status' => 'inscrito',
                    'rodada' => 1,
                ];
            }
        }
    
        foreach (array_chunk($inscricoesParaFazer, 1000) as $chunk) {
            DB::table('inscricoes')->insert($chunk);
        }
    }
}