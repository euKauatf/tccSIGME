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
     * @var string
     */
    protected $signature = 'import:locals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import locals from database/locais.txt (formato: nome: XX vagas)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->info("🚀 Começando importação de locais...");

        DB::statement("SET session_replication_role = 'replica';");

        // Limpa locais existentes para evitar duplicatas
        Local::truncate();

        $filePath = database_path('locais.txt');

        if (!file_exists($filePath)) {
            $this->error("❌ Arquivo não encontrado em: " . $filePath);
            Log::error("Arquivo de seeder não encontrado: " . $filePath);
            return self::FAILURE;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $locaisParaInserir = [];
        $ignoredCount = 0;

        foreach ($lines as $line) {
            // Divide a linha pelo primeiro ":" para separar nome e capacidade
            $parts = explode(':', $line, 2);

            // Garante que a linha tem o formato esperado "Nome: Capacidade"
            if (count($parts) === 2) {
                $nome = trim($parts[0]);
                // **AQUI ESTÁ A MUDANÇA PRINCIPAL**
                // Converte a segunda parte para inteiro.
                // O PHP extrai o número do início da string (ex: "186 vagas" vira 186).
                $capacidade = (int) $parts[1];

                if (!empty($nome) && $capacidade > 0) {
                    $locaisParaInserir[] = [
                        'name'       => $nome,
                        'capacidade' => $capacidade,
                    ];
                } else {
                    $ignoredCount++;
                    Log::warning("Linha com nome vazio ou capacidade inválida ignorada: $line");
                }
            } else {
                $ignoredCount++;
                Log::warning("Linha mal formatada (faltando ':') ignorada: $line");
            }
        }

        if (!empty($locaisParaInserir)) {
            Local::insert($locaisParaInserir);
        }

        DB::statement("SET session_replication_role = 'origin';");

        $this->info("✅ " . count($locaisParaInserir) . " locais importados com sucesso!");
        if ($ignoredCount > 0) {
            $this->warn("⚠️  $ignoredCount linhas foram ignoradas por inconsistência no formato.");
        }

        return self::SUCCESS;
    }
}