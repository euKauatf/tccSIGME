<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;

class SorteioService
{
    // Realiza o sorteio
    public function realizarSorteio()
    {
        $eventos = Event::with(['users' => function ($query) {
            // Pega todos os eventos que têm usuários inscritos
            $query->wherePivot('status', 'inscrito');
        }])->get();

        // Verifica se há eventos com alunos inscritos
        if ($eventos->isEmpty() || $eventos->every(fn($evento) => $evento->users->isEmpty())) {
            return ['error' => 'Não há eventos ou alunos inscritos para realizar o sorteio.'];
        }

        $horariosOcupados = [];  // Vai servir para verificar os horários
        $resultadoFinal = [];    // Vai armazenar o resultado final do sorteio

        foreach ($eventos as $evento) {
            $inscritos = $evento->users()->wherePivot('status', 'inscrito')->get()->shuffle();
            $vagasOcupadas = $evento->users()->wherePivot('status', 'selecionado')->count();
            $vagasDisponiveis = $evento->vagas_max - $vagasOcupadas;

            // Verifica se o evento tem vagas ou se não tem ninguém inscrito
            if ($vagasDisponiveis <= 0 || $inscritos->isEmpty()) {
                $resultadoFinal[] = [
                    'evento' => $evento->tema,
                    'mensagem' => $vagasDisponiveis <= 0 ? 'Sem vagas disponíveis.' : 'Sem inscritos para sortear.',
                    'selecionados' => []
                ];
                continue; // Passa para o próximo evento
            }

            $selecionadosNesteEvento = collect(); // Coleta os usuários sorteados

            foreach ($inscritos as $inscrito) {
                // Verifica se o aluno já foi selecionado para outro evento no mesmo dia e horário
                if ($selecionadosNesteEvento->count() >= $vagasDisponiveis) {
                    break;  // Se o número de selecionados já for suficiente, interrompe o loop
                }

                $horarioJaOcupado = isset($horariosOcupados[$inscrito->id][$evento->data]) &&
                    in_array($evento->horario_inicio, $horariosOcupados[$inscrito->id][$evento->data]);

                // Se o horário não estiver ocupado, adiciona o aluno
                if (!$horarioJaOcupado) {
                    $selecionadosNesteEvento->push($inscrito);
                    $horariosOcupados[$inscrito->id][$evento->data][] = $evento->horario_inicio;
                }
            }

            // Registra o resultado do sorteio
            $resultadoFinal[] = [
                'evento' => $evento->tema,
                'selecionados' => $selecionadosNesteEvento->pluck('name')
            ];
        }

        return $resultadoFinal;  // Retorna o resultado final do sorteio
    }
}
