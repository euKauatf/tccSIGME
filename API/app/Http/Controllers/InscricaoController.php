<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    return response()->json([
      'message' => 'Inscrição realizada com sucesso!',
      'event' => $event
    ], 201);
  }
}
