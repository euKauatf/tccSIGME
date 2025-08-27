<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuditLogger;

class InscricaoController extends Controller
{
    /**
     * Inscreve o usuário em um evento.
     */
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

        AuditLogger::log($user, 'inscreveu-se', $event);

        return response()->json([
            'message' => 'Inscrição realizada com sucesso!',
            'event'   => $event
        ], 201);
    }

    /**
     * Cancela a inscrição do usuário no evento.
     */
    public function destroy(Request $request, Event $event)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Não autorizado.'], 401);
        }

        if (!$user->eventos()->where('events_id', $event->id)->exists()) {
            return response()->json(['message' => 'Você não está inscrito neste evento.'], 404);
        }

        $user->eventos()->detach($event->id);

        AuditLogger::log($user, 'cancelou inscrição', $event);

        return response()->json([
            'message' => 'Inscrição cancelada com sucesso.'
        ], 200);
    }
}
    