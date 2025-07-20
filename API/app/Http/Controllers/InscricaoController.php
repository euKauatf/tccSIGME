<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditLogger;

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

    $user->eventos()->attach($event->id, ['status' => 'inscrito']);

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
} 
