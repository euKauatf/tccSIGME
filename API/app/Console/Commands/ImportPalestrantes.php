<?php

namespace App\Console\Commands;

use App\Models\Palestrante;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportPalestrantes extends Command
{
  /**
   * The name and signature of the console command.
   *
   * Example usage: php artisan import:palestrantes
   */
  protected $signature = 'import:palestrantes';

  /**
   * The console command description.
   */
  protected $description = 'Import palestrantes from database/palestrantes.txt';

  /**
   * Execute the console command.
   */
  public function handle(): int
  {
    $this->info("Começando import de palestrantes...");

    DB::statement("SET session_replication_role = 'replica';");

    // Limpa a tabela de palestrantes
    Palestrante::truncate();

    // Caminho do arquivo
    $filePath = database_path('palestrantes.txt');

    if (!file_exists($filePath)) {
      $this->error("❌ Arquivo não encontrado em: " . $filePath);
      Log::error("Arquivo de seeder não encontrado: " . $filePath);
      return self::FAILURE;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $palestrantesParaInserir = [];

    for ($i = 0; $i < count($lines); $i += 3) {
      // Verifica se existem as três linhas para o palestrante
      if (isset($lines[$i]) && isset($lines[$i + 1]) && isset($lines[$i + 2])) {
        $name = trim($lines[$i]);
        $telefone = trim($lines[$i + 1]);
        $email = trim($lines[$i + 2]);

        // Adiciona o palestrante ao array se o name não estiver vazio
        if (!empty($name)) {
          $palestrantesParaInserir[] = [
            'name'     => $name,
            'telefone' => ($telefone !== 'Não informado') ? $telefone : null,
            'email'    => ($email !== 'Não informado') ? $email : null,
          ];
        }
      }
    }

    // Insere os palestrantes no banco de dados
    if (!empty($palestrantesParaInserir)) {
      Palestrante::insert($palestrantesParaInserir);
    }

    DB::statement("SET session_replication_role = 'origin';");

    $this->info(count($palestrantesParaInserir) . " palestrantes importados com sucesso!");
    return self::SUCCESS;
  }
}
