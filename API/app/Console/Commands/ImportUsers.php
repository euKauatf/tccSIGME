<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ImportUsers extends Command
{
  /**
   * The name and signature of the console command.
   *
   * Example usage: php artisan import:users
   */
  protected $signature = 'import:users';

  /**
   * The console command description.
   */
  protected $description = 'Import users (admin + alunos) from database/alunos.txt';

  /**
   * Execute the console command.
   */
  public function handle(): int
  {
    $this->info("Começando import de usuário...");

    DB::statement("SET session_replication_role = 'replica';");

    //limpa usuários
    User::truncate();

    //cria admin
    User::create([
      'name'      => 'Administrador',
      'matricula' => '00000001',
      'password'  => Hash::make('12345678'),
      'tipo'      => 'adm',
    ]);

    $this->info('Usuário Administrador criado com sucesso!');

    //caminho do arquivo
    $filePath = database_path('alunos.txt');

    if (!file_exists($filePath)) {
      $this->error("❌ Arquivo não encontrado em: " . $filePath);
      Log::error("Arquivo de seeder não encontrado: " . $filePath);
      return self::FAILURE;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $alunosParaInserir = [];
    $dataAtual = now();
    $matriculasProcessadas = [];

    foreach ($lines as $line) {
      $parts = preg_split('/\s+/', $line, 2);

      if (count($parts) === 2) {
        $matricula = trim($parts[0]);
        $nome = trim($parts[1]);

        if (empty($matricula) || empty($nome) || isset($matriculasProcessadas[$matricula])) {
          continue;
        }

        $alunosParaInserir[] = [
          'name'       => $nome,
          'matricula'  => $matricula,
          'password'   => Hash::make('Mudar123'),
          'tipo'       => 'aluno',
          'created_at' => $dataAtual,
          'updated_at' => $dataAtual,
        ];

        $matriculasProcessadas[$matricula] = true;
      }
    }

    if (!empty($alunosParaInserir)) {
      foreach (array_chunk($alunosParaInserir, 500) as $chunk) {
        User::insert($chunk);
      }
    }

    DB::statement("SET session_replication_role = 'origin';");

    $this->info(count($alunosParaInserir) . " alunos importados com sucesso!");
    return self::SUCCESS;
  }
}
