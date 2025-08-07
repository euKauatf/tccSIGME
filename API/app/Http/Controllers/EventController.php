<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
  public function index()
  {
    return Event::orderBy('horario_inicio', 'desc')->get();
  }

  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'tema' => 'required|string|max:255',
      'palestrante' => 'required|string|max:255',
      'vagas_max' => 'required|numeric',
      'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
      'horario_inicio' => 'required|date_format:H:i',
      'horario_termino' => 'required|date_format:H:i|after_or_equal:horario_inicio',
      'local' => 'required|string',
      'descricao' => 'required|string', // <-- ADICIONE ESTA LINHA
    ]);
    //$validatedData['horario_termino'] = $validatedData['horario_inicio'];

    $event = Event::create($validatedData);

    return response()->json($event, 201);
  }

  public function show(Event $event)
  {
    return response()->json($event);
  }

  public function update(Request $request, Event $event)
  {
    $validate = $request->validate([
      'tema' => 'sometimes|required|string|max:255',
      'palestrante' => 'sometimes|required|string|max:255',
      'vagas_max' => 'sometimes|required|numeric',
      'horario_inicio' => 'sometimes|required|date_format:H:i',
      'horario_termino' => 'sometimes|required|date_format:H:i|after:horario_inicio',
      'descricao' => 'sometimes|required|string',
      'local' => 'sometimes|required|string',
    ]);

    $event->update($validate);

    return response()->json($event, 200);
  }

  public function destroy(Event $event)
  {
    $event->delete();
    return response()->json(null, 204);
  }
}
