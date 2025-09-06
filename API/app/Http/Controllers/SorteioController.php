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

    $resultadoFinal = []; // Corrigido para usar a mesma variável em todo o ficheiro
    $horariosOcupados = []; //vai servir pra verificação dos horários (pro aluno não ser sorteado pra 2 num mesmo tempo)

    $rodadaAtual = DB::table('inscricoes')->max('rodada') ?? 1;//variável que vai armazenar qual q é a rodada atual
    $novaRodada = $rodadaAtual + 1;//vai armazenar o valor da próxima rodada

    foreach ($eventos as $evento) { //nesse foreach vai ir de evento em evento
      $inscritos = $evento->users()->wherePivot('status', 'inscrito')->get()->shuffle();
      $vagasOcupadas = $evento->users()->wherePivot('status', 'contemplado')->count();
      $vagasDisponiveis = $evento->vagas_max - $vagasOcupadas;

      if ($vagasDisponiveis <= 0 || $inscritos->isEmpty()) { //verifica se o evento ainda tem vagas disponíveis ou se não tem ngm inscrito
        
        if($vagasDisponiveis <= 0){
          foreach ($evento->users as $user) { //pega os usuários que estão nesses eventos
            $evento->users()->updateExistingPivot($user->id, [
              'status' => 'nao contemplado',
              'rodada' => $novaRodada  //transforma todos esses usuários em "nao contemplado" pois não tem mais vagas
            ]);
            // CORRIGIDO: Removido o 'A' extra de 'AAuditLogger'
             AuditLogger::log($user, "foi nao contemplado na rodada {$novaRodada}", $evento);
          }
        }
        $resultadoFinal[] = [
          'evento' => $evento->tema,
          'mensagem' => $vagasDisponiveis <= 0 ? 'Sem vagas disponíveis.' : 'Sem inscritos para sortear.',
          'contemplados' => []
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
          'status' => 'contemplado',
          'rodada' => $novaRodada
        ]);
        AuditLogger::log($selecionado, "foi contemplado na rodada {$novaRodada}", $evento);
      } // CORRIGIDO: Removida uma chave '}' extra que estava aqui

      $resultadoFinal[] = [
        'evento' => $evento->tema,
        'contemplados' => $selecionadosNesteEvento->pluck('name')
      ];

      $naoSelecionados = $inscritos->diff($selecionadosNesteEvento);

      foreach ($naoSelecionados as $naoSelecionado) { //vai transformar o status de inscrição desse usuários não chamados para "nao contemplado"
        $evento->users()->updateExistingPivot($naoSelecionado->id, [
          'status' => 'nao contemplado',
          'rodada' => $novaRodada
        ]);
        AuditLogger::log($naoSelecionado, "nao foi contemplado na rodada {$novaRodada}", $evento);
      }
    } // CORRIGIDO: Adicionada a chave '}' que faltava para fechar o loop principal


    return response()->json([ //no final de tudo vai responder com esse json 
      'mensagem' => 'Sorteio finalizado.',
      'resultados' => $resultadoFinal // CORRIGIDO: Retornando a variável correta
    ]);
  }

  //função q vai dar um clear no sorteio inteiro
  public function clearSorteio(): JsonResponse
  {
    $rodadaAtual = DB::table('inscricoes')->max('rodada') ?? 1;//variável que vai armazenar qual q é a rodada atual
    $rodadaAnterior = max(1, $rodadaAtual - 1);//vai armazenar o valor da próxima rodada

    
    $eventos = Event::with(['users' => function ($query) use ($rodadaAtual){ //pega todos os eventos q tem usuários selecionados e cancelados apenas da rodada atual
      $query->wherePivot('rodada', $rodadaAtual)
      ->wherePivotIn('status', ['nao contemplado', 'contemplado']);
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