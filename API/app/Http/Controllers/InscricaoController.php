<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse; 

class InscricaoController extends Controller
{
  public function store(Request $request, Event $event)
  {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    if (!$user) {
      return response()->json(['message' => 'Não autorizado.'], 401);
    }

    if ($user->eventos()->where('events_id', $event->id)->exists()) {
      return response()->json(['message' => 'Você já está inscrito neste evento.'], 409);
    }
    
    $rodadaAtual = DB::table('inscricoes')->max('rodada') ?? 1;

    $user->eventos()->attach($event->id, [
      'status' => 'inscrito',
      'rodada' => $rodadaAtual,  
    ]);

    // Registra a ação de inscrição no log de auditoria.
    AuditLogger::log($user, 'inscreveu-se', $event);

    return response()->json([
      'message' => 'Inscrição realizada com sucesso!',
      'event' => $event
    ], 201);
  }


  /**
   * Cancela a inscrição do usuário no evento.
   *
   * @param Request $request
   * @param Event $event
   * @return \Illuminate\Http\JsonResponse
   */
  public function destroy(Request $request, Event $event)
  {
    $user = Auth::user();

    if (!$user) {
      return response()->json(['message' => 'Não autorizado.'], 401);
    }

    // Usa detach() para remover a associação.
    // O método retorna o número de registros removidos.
    $user->eventos()->detach($event->id);

    // Registra a ação de cancelamento de inscrição no log de auditoria.
    AuditLogger::log($user, 'cancelou inscrição', $event);

    return response()->json([
      'message' => 'Inscrição cancelada com sucesso.'
    ], 200); // 200 OK
  }

  /**
   * Marca a presença de um aluno em um evento via QR Code.
   * Acessível apenas por administradores.
   */
  public function marcarPresenca(Request $request): JsonResponse
  {
      /** @var User $admin */
      $admin = Auth::user();
      
      $request->validate([
          
          'matricula' => 'required|string|exists:users,matricula',
          'event_id' => 'required|integer|exists:events,id',
      ]);

      $aluno = User::where('matricula', $request->input('matricula'))->first();
      $eventId = $request->input('event_id');
      
      $inscricao = DB::table('inscricoes')
          ->where('user_id', $aluno->id)
          ->where('events_id', $eventId)
          ->first();

      if (!$inscricao) {
          
          return response()->json(['message' => "Aluno {$aluno->name} não está inscrito neste evento."], 404);
      }

      if ($inscricao->status === 'presente') {
          return response()->json(['message' => "Presença de {$aluno->name} já registrada."], 409); 
      }

      if ($inscricao->status !== 'contemplado') {
          return response()->json(['message' => "Apenas alunos com status 'contemplado' podem ter a presença marcada. Status atual: {$inscricao->status}"], 403);
      }

  
      DB::table('inscricoes')
          ->where('id', $inscricao->id)
          ->update(['status' => 'presente']);
      AuditLogger::log(auth()->user(), 'Presença marcada para o usuário: ' . $user->name . ' no evento: ' . $evento->nome);

      return response()->json(['message' => "Presença de {$aluno->name} confirmada com sucesso!"]);
  }
}