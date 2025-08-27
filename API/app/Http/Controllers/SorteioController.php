<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;

class SorteioController extends Controller
{
    /**
     * Realiza o sorteio de eventos e registra os logs de auditoria.
     * 
     * @return JsonResponse
     */
    public function realizarSorteio(): JsonResponse
    {
        $eventos = Event::with(['users' => function ($query) { 
            $query->wherePivot('status', 'inscrito');
        }])->get();

        // Verifica se há eventos com alunos inscritos
        if ($eventos->isEmpty() || $eventos->every(fn($evento) => $evento->users->isEmpty())) {
            return response()->json([
                'mensagem' => 'Não há eventos ou alunos inscritos para realizar o sorteio.',
            ], 400);
        }

        $resultadoFinal = [];
        $horariosOcupados = [];

        foreach ($eventos as $evento) {
            $inscritos = $evento->users()->wherePivot('status', 'inscrito')->get()->shuffle();
            $vagasOcupadas = $evento->users()->wherePivot('status', 'selecionado')->count();
            $vagasDisponiveis = $evento->vagas_max - $vagasOcupadas;

            if ($vagasDisponiveis <= 0 || $inscritos->isEmpty()) {
                $resultadoFinal[] = [
                    'evento' => $evento->tema,
                    'mensagem' => $vagasDisponiveis <= 0 ? 'Sem vagas disponíveis.' : 'Sem inscritos para sortear.',
                    'selecionados' => []
                ];
                continue;
            }

            $selecionadosNesteEvento = collect();
            foreach ($inscritos as $inscrito) {
                if ($selecionadosNesteEvento->count() >= $vagasDisponiveis) {
                    break;
                }

                $horarioJaOcupado = isset($horariosOcupados[$inscrito->id][$evento->data]) &&
                    in_array($evento->horario_inicio, $horariosOcupados[$inscrito->id][$evento->data]);
                if (!$horarioJaOcupado) {
                    $selecionadosNesteEvento->push($inscrito);
                    $horariosOcupados[$inscrito->id][$evento->data][] = $evento->horario_inicio;
                }
            }

            // Atualiza o status dos usuários selecionados
            foreach ($selecionadosNesteEvento as $selecionado) {
                $evento->users()->updateExistingPivot($selecionado->id, ['status' => 'selecionado']);
                // Registrar a ação de auditoria
                AuditLogger::log($selecionado, 'foi selecionado', $evento);
            }

            $resultadoFinal[] = [
                'evento' => $evento->tema,
                'selecionados' => $selecionadosNesteEvento->pluck('name')
            ];

            // Atualiza o status dos usuários não selecionados para 'cancelado'
            $naoSelecionados = $inscritos->diff($selecionadosNesteEvento);
            foreach ($naoSelecionados as $naoSelecionado) {
                $evento->users()->updateExistingPivot($naoSelecionado->id, ['status' => 'cancelado']);
                AuditLogger::log($naoSelecionado, 'foi cancelado', $evento);
            }
        }

        return response()->json([
            'mensagem' => 'Sorteio finalizado.',
            'resultados' => $resultadoFinal
        ]);
    }

    /**
     * Limpa o sorteio e restaura todos os usuários para "inscritos".
     * 
     * @return JsonResponse
     */
    public function clearSorteio(): JsonResponse
    {
        $eventos = Event::with(['users' => function ($query) {
            $query->wherePivotIn('status', ['selecionado', 'cancelado']);
        }])->get();

        if ($eventos->isEmpty() || $eventos->every(fn($evento) => $evento->users->isEmpty())) {
            return response()->json([
                'mensagem' => 'Não há sorteios realizados para limpar.',
            ], 400);
        }

        foreach ($eventos as $evento) {
            foreach ($evento->users as $user) {
                $evento->users()->updateExistingPivot($user->id, ['status' => 'inscrito']);
            }
        }

        return response()->json([
            'mensagem' => 'Sorteio Limpo'
        ]);
    }
}
