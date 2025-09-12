<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa eventos do arquivo database/eventos.txt';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->info("📥 Iniciando importação de eventos...");

        DB::statement("SET session_replication_role = 'replica';");
        Event::truncate();

        $filePath = database_path('eventos.txt');

        if (!file_exists($filePath)) {
            $this->error("❌ Arquivo não encontrado em: " . $filePath);
            Log::error("Arquivo eventos.txt não encontrado: " . $filePath);
            return self::FAILURE;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES);

        $eventosParaInserir = [];
        $dataAtual = now();

        $eventoAtual = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if (empty($line)) {
                if (!empty($eventoAtual)) {
                    $eventosParaInserir[] = array_merge($eventoAtual, [
                        'descricao'  => 'Descrição não fornecida na importação.', // <-- VALOR PADRÃO ADICIONADO
                        'created_at' => $dataAtual,
                        'updated_at' => $dataAtual,
                    ]);
                    $eventoAtual = [];
                }
                continue;
            }

            if (str_starts_with($line, 'Palestra:')) {
                $eventoAtual['tema'] = trim(str_replace('Palestra:', '', $line));
            } elseif (str_starts_with($line, 'Hora de início:')) {
                $eventoAtual['horario_inicio'] = trim(str_replace('Hora de início:', '', $line));
            } elseif (str_starts_with($line, 'Hora de término:')) {
                $eventoAtual['horario_termino'] = trim(str_replace('Hora de término:', '', $line));
            } elseif (str_starts_with($line, 'Dia:')) {
                $eventoAtual['data'] = trim(str_replace('Dia:', '', $line));
            } elseif (str_starts_with($line, 'Sala:')) {
                $eventoAtual['local'] = trim(str_replace('Sala:', '', $line));
            } elseif (str_starts_with($line, 'Quantidade de Vagas:')) {
                $eventoAtual['vagas_max'] = (int) trim(str_replace('Quantidade de Vagas:', '', $line));
            } elseif (str_starts_with($line, 'Palestrante:')) {
                $eventoAtual['palestrante'] = trim(str_replace('Palestrante:', '', $line));
            } elseif (str_starts_with($line, 'E-mail para contato:')) {
                $email = trim(str_replace('E-mail para contato:', '', $line));
                $eventoAtual['email_palestrante'] = $email !== 'Não informado' ? $email : null;
            } elseif (str_starts_with($line, 'Número para contato:')) {
                $tel = trim(str_replace('Número para contato:', '', $line));
                $eventoAtual['telefone_palestrante'] = $tel !== 'Não informado' ? $tel : null;
            }
        }

        // Garante que o último evento do arquivo seja salvo
        if (!empty($eventoAtual)) {
            $eventosParaInserir[] = array_merge($eventoAtual, [
                'descricao'  => 'Descrição não fornecida na importação.', // <-- VALOR PADRÃO ADICIONADO
                'created_at' => $dataAtual,
                'updated_at' => $dataAtual,
            ]);
        }

        if (!empty($eventosParaInserir)) {
            foreach (array_chunk($eventosParaInserir, 200) as $chunk) {
                Event::insert($chunk);
            }
        }

        DB::statement("SET session_replication_role = 'origin';");

        $this->info(count($eventosParaInserir) . " eventos importados com sucesso! ✅");
        return self::SUCCESS;
    }
}