<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Services\AuditLogger;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SorteioController extends Controller
{

  //realiza o sorteio

  public function realizarSorteio(): JsonResponse
  {
    $eventos = Event::with(['users' => function ($query) { //pega todos os eventos q tem usuários inscritos
      $query->wherePivot('status', 'inscrito');
    }])->get();

    $resultado = []; //vai servir pro log dps
    $horariosOcupados = []; //vai servir pra verificação dos horários (pro aluno não ser sorteado pra 2 num mesmo tempo)

    $rodadaAtual = DB::table('inscricoes')->max('rodada') ?? 1;//variável que vai armazenar qual q é a rodada atual
    $novaRodada = $rodadaAtual + 1;//vai armazenar o valor da próxima rodada

    foreach ($eventos as $evento) { //nesse foreach vai ir de evento em evento
      $inscritos = $evento->users()->wherePivot('status', 'inscrito')->get()->shuffle();
      $vagasOcupadas = $evento->users()->wherePivot('status', 'selecionado')->count();
      $vagasDisponiveis = $evento->vagas_max - $vagasOcupadas;

      if ($vagasDisponiveis <= 0 || $inscritos->isEmpty()) { //verifica se o evento ainda tem vagas disponíveis ou se não tem ngm inscrito
          
        if($vagasDisponiveis <= 0){
          foreach ($evento->users as $user) { //pega os usuários que estão nesses eventos
            $evento->users()->updateExistingPivot($user->id, [
              'status' => 'cancelado',
              'rodada' => $novaRodada  //transforma todos esses usuários em "cancelado" pois não tem mais vagas
            ]);
            AuditLogger::log($user, 'foi cancelado', $evento); 
          }
        }
        $resultadoFinal[] = [
          'evento' => $evento->tema,
          'mensagem' => $vagasDisponiveis <= 0 ? 'Sem vagas disponíveis.' : 'Sem inscritos para sortear.',
          'selecionados' => []
        ];
        continue; // Pula para o próximo evento no loop
      }

      $selecionadosNesteEvento = collect(); // Cria uma coleção vazia para os selecionados deste evento.

      foreach ($inscritos as $inscrito) {
        // Verifica se o aluno já foi selecionado para outro evento no mesmo dia e horário
        if ($selecionadosNesteEvento->count() >= $vagasDisponiveis) {
          break;
        }

        $horarioJaOcupado = isset($horariosOcupados[$inscrito->id][$evento->data]) &&
          in_array($evento->horario_inicio, $horariosOcupados[$inscrito->id][$evento->data]);
        if (!$horarioJaOcupado) {
          // Adiciona o usuário à lista de selecionados deste evento.
          $selecionadosNesteEvento->push($inscrito);

          // Marca o horário como ocupado para este usuário.
          $horariosOcupados[$inscrito->id][$evento->data][] = $evento->horario_inicio;
        }
      }

      foreach ($selecionadosNesteEvento as $selecionado) {
        $evento->users()->updateExistingPivot($selecionado->id, [
          'status' => 'selecionado',
          'rodada' => $novaRodada
        ]);
        // AuditLogger::log($selecionado, 'foi selecionado', $evento);
      }

      $resultadoFinal[] = [
        'evento' => $evento->tema,
        'selecionados' => $selecionadosNesteEvento->pluck('name')
      ];

      $naoSelecionados = $inscritos->diff($selecionadosNesteEvento);

      foreach ($naoSelecionados as $naoSelecionado) { //vai transformar o status de inscrição desse usuários não chamados para "cancelado"
        $evento->users()->updateExistingPivot($naoSelecionado->id, [
          'status' => 'cancelado',
          'rodada' => $novaRodada
        ]);
        AuditLogger::log($naoSelecionado, 'foi cancelado', $evento); //manda um log falando qm foi cancelado
      }
    }


    return response()->json([ //no final de tudo vai responder com esse json 
      'mensagem' => 'Sorteio finalizado.',
      'resultados' => $resultado
    ]);
  }

  //função q vai dar um clear no sorteio inteiro
  public function clearSorteio(): JsonResponse
  {
    $rodadaAtual = DB::table('inscricoes')->max('rodada') ?? 1;//variável que vai armazenar qual q é a rodada atual
    $rodadaAnterior = max(1, $rodadaAtual - 1);//vai armazenar o valor da próxima rodada

    
    $eventos = Event::with(['users' => function ($query) use ($rodadaAtual){ //pega todos os eventos q tem usuários selecionados e cancelados apenas da rodada atual
      $query->wherePivot('rodada', $rodadaAtual)
      ->wherePivotIn('status', ['cancelado', 'selecionado']);
    }])->get();

    foreach ($eventos as $evento) {
      foreach ($evento->users as $user) { //pega os usuários que estão nesses eventos
        $evento->users()->updateExistingPivot($user->id, [
          'status' => 'inscrito',
          'rodada' => $rodadaAnterior
        ]); //transforma todos esses usuários em "inscritos" nos eventos novamente e volta a rodada inicial em que eles fizeram a inscrição
      }
    }
    return response()->json([ //no final responde com esse json
      'message' => 'Sorteio Limpo'
    ]);
  }
}