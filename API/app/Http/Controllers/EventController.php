<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
  public function index()
  {
    return Event::orderBy('horario_inicio', 'desc')->get();
  }

  public function store(Request $request)
  {
    // Regras do método rules() de EventFormRequest movidas para cá.
    $uniqueRule = Rule::unique('events')->where(function ($query) use ($request) {
      return $query->where('data', $request->data)
        ->where(function ($q) use ($request) {
          $q->where('horario_inicio', '<', $request->horario_termino)
            ->where('horario_termino', '>', $request->horario_inicio);
        });
    });

    $validatedData = $request->validate([
      'tema' => ['required', 'string', 'max:255', $uniqueRule],
      'vagas_max' => 'required|numeric|gt:4',
      'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
      'horario_inicio' => 'required|date_format:H:i',
      'horario_termino' => 'required|date_format:H:i|after:horario_inicio',
      'descricao' => 'required|string|required|max:400',
      'email_palestrante' => 'required|email|max:255',
      'telefone_palestrante' => 'required|string|max:20',
      'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
      'local' => ['required', 'string', $uniqueRule],
    ], [

      'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
      'local.unique' => 'Este local já está reservado em um evento no momento.',
      'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
      'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
      'data.in' => 'A data deve ser uma das seguintes: Segunda, Terça, Quarta, Quinta ou Sexta.',
      'horario_termino.after' => 'O horário de término deve ser depois do horário de início.',
      'tema.unique' => 'Já existe um evento com esse tema nesta data e horário.',
    ]);

    $event = Event::create($validatedData);

    return response()->json($event, 201);
  }

  public function show(Event $event)
  {
    return response()->json($event);
  }

  public function update(Request $request, Event $event)
  {
    // Regras do método updateRules() de EventFormRequest movidas para cá.
    $uniqueRule = Rule::unique('events')->where(function ($query) use ($request) {
      return $query->where('data', $request->data)
        ->where('horario_inicio', $request->horario_inicio);
    })->ignore($event->id);

    $validatedData = $request->validate([
      'tema' => ['sometimes', 'required', 'string', 'max:255', $uniqueRule],
      'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
      'email_palestrante' => 'required|string|max:255',
      'telefone_palestrante' => 'required|string|max:20',
      'vagas_max' => 'sometimes|required|numeric|gt:4',
      'horario_inicio' => 'sometimes|required|date_format:H:i',
      'horario_termino' => 'sometimes|required|date_format:H:i|after:horario_inicio',
      'descricao' => 'sometimes|required|string|max:400',
      'local' => ['sometimes', 'required', 'string', $uniqueRule],
    ], [
      // Reutilizando as mensagens de erro relevantes.
      'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
      'local.unique' => 'Este local já está reservado em um evento no momento.',
      'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
      'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
      'data.in' => 'A data deve ser uma das seguintes: Segunda, Terça, Quarta, Quinta ou Sexta.',
      'horario_termino.after' => 'O horário de término deve ser depois do horário de início.',
      'tema.unique' => 'Ja existe um evento com esse tema nesta data e horario.',
    ]);

    $event->update($validatedData);

    return response()->json($event, 200);
  }

  public function destroy(Event $event)
  {
    $event->delete();
    return response()->json(null, 204);
  }
}
