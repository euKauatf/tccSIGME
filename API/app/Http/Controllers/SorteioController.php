<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Services\AuditLogger;
use App\Models\User;

class SorteioController extends Controller
{

  //realiza o sorteio

  public function realizarSorteio(): JsonResponse
  {
    $eventos = Event::with(['users' => function ($query) { //pega todos os eventos q tem usuários inscritos
      $query->wherePivot('status', 'inscrito');
    }])->get();

    $resultado = []; //vai servir pro log dps

    foreach ($eventos as $evento) { //nesse foreach vai ir de evento em evento
      $inscritos = $evento->users;
      $vagasDisponiveis = $evento->vagas_max - $evento->users()->wherePivot('status', 'selecionado')->count(); //essa variável vai ver quantas são as vagas disponíveis desse evento 

      if ($vagasDisponiveis <= 0 || $inscritos->isEmpty()) { //verifica se o evento ainda tem vagas disponíveis ou se não tem ngm inscrito

        if (!$inscritos->isEmpty()) { //verifica se o evento está apenas com as vagas totalmente preenchidas e não sem alunos inscritos
          foreach ($inscritos as $inscrito) { //vai transformar o status de inscrição desses usuários não chamados para "cancelado"
            $evento->users()->updateExistingPivot($inscrito->id, ['status' => 'cancelado']);
            AuditLogger::log($inscrito->user, 'foi cancelado', $evento); //manda um log falando qm foi cancelado
          }
        }

        $resultado[] = [
          'evento' => $evento->tema,
          'mensagem' => 'Sem vagas disponíveis ou sem inscritos.'
        ];
        continue;
      }


      $selecionados = $inscritos->shuffle()->take($vagasDisponiveis); //sorteia os usuários aleatoriamente e pega apenas até o número de vagas

      foreach ($selecionados as $user) {
        $evento->users()->updateExistingPivot($user->id, ['status' => 'selecionado']); //vai efetivar esses usuários selecionados
        AuditLogger::log($user, 'foi selecionado', $evento); //manda um log falando qm foi selecionado
      }

      $resultado[] = [
        'evento' => $evento->tema,
        'selecionados' => $selecionados->pluck('name') //vai armazenar qm ficou selecionado em qual palestra
      ];

      $naoSelecionados = $inscritos->diff($selecionados); //vai pegar os usuáiros q não foram chamados pro evento


      foreach ($naoSelecionados as $user) { //vai transformar o status de inscrição desse usuários não chamados para "cancelado"
        $evento->users()->updateExistingPivot($user->id, ['status' => 'cancelado']);
        AuditLogger::log($user, 'foi cancelado', $evento); //manda um log falando qm foi cancelado
      }
    }

    return response()->json([ //no final de tudo vai responder com esse json 
      'mensagem' => 'Sorteio finalizado.',
      'resultados' => $resultado
    ]);
  }


  //função q vai dar um clear no sorteio inteiro
  public function clearSorteio()
  {
    $eventos = Event::with(['users' => function ($query) { //pega todos os eventos q tem usuários selecionados e cancelados
      $query->wherePivotIn('status', ['selecionado', 'cancelado']);
    }])->get();

    foreach ($eventos as $evento) {
      foreach ($evento->users as $user) { //pega os usuários que estão nesses eventos
        $evento->users()->updateExistingPivot($user->id, ['status' => 'inscrito']); //transforma todos esses usuários em "inscritos" nos eventos novamente 
      }
    }
    return response()->json([ //no final responde com esse json
      'message' => 'Sorteio Limpo'
    ]);
  }
}
