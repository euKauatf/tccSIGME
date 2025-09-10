<?php

namespace App\Console\Commands;

use App\Models\Local;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportLocals extends Command
{
  /**
   * The name and signature of the console command.
   *
   * Example usage: php artisan import:locals
   */
  protected $signature = 'import:locals';

  /**
   * The console command description.
   */
  protected $description = 'Import locals from database/locais.txt';

  /**
   * Execute the console command.
   */
  public function handle(): int
  {
    $this->info("Começando import de locais...");

    DB::statement("SET session_replication_role = 'replica';");

    //limpa usuários
    Local::truncate();

    //caminho do arquivo
    $filePath = database_path('locais.txt');

    if (!file_exists($filePath)) {
      $this->error("❌ Arquivo não encontrado em: " . $filePath);
      Log::error("Arquivo de seeder não encontrado: " . $filePath);
      return self::FAILURE;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    $locaisParaInserir = [];

    // Itera sobre o arquivo, pegando de 2 em 2 linhas (nome e capacidade)
    for ($i = 0; $i < count($lines); $i += 2) {
      // Verifica se existem as duas linhas para o local
      if (isset($lines[$i]) && isset($lines[$i + 1])) {
        $nome = trim($lines[$i]);
        $capacidade = trim($lines[$i + 1]);

        // Adiciona o local ao array se o nome não estiver vazio e a capacidade for um número
        if (!empty($nome) && is_numeric($capacidade)) {
          $locaisParaInserir[] = [
            'name'       => $nome,
            'capacidade' => (int) $capacidade,
          ];
        }
      }
    }

    // Insere os locais no banco de dados
    if (!empty($locaisParaInserir)) {
      Local::insert($locaisParaInserir);
    }
    DB::statement("SET session_replication_role = 'origin';");

    $this->info(count($locaisParaInserir) . " locais importados com sucesso!");
    return self::SUCCESS;
  }
}
