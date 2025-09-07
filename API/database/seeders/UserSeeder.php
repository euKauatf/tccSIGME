<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    DB::statement("SET session_replication_role = 'replica';");

    User::truncate();

    $filePath = database_path('alunos.txt');

    if (!file_exists($filePath)) {
      $this->command->error("O arquivo de alunos não foi encontrado em database/alunos.txt");
      return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $processedMatriculas = [];

    foreach ($lines as $line) {
      $parts = explode("\t", $line, 2);

      if (count($parts) === 2) {
        $matricula = trim($parts[0]);
        $nome = trim($parts[1]);

        if (empty($matricula) || empty($nome) || isset($processedMatriculas[$matricula])) {
          continue;
        }

        User::updateOrCreate(
          ['matricula' => $matricula],
          [
            'name' => $nome,
            'email' => $matricula,
            'password' => Hash::make('12345678'),
            'tipo' => 'aluno',
          ]
        );

        $processedMatriculas[$matricula] = true;
      }
    }

    DB::statement("SET session_replication_role = 'origin';");

    $this->command->info('Tabela de usuários criada :D');
  }
}
