<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Validation\Rule; // Uso da validação de regra personalizada 100%fiel

class EventController extends Controller
{
  public function index()
  {
    return Event::orderBy('horario_inicio', 'desc')->get();
  }

  public function store(Request $request)
  {

    $uniqueRule = Rule::unique('events')->where(function ($query) use ($request) {
      return $query->where('data', $request->data)
        ->where(function ($q) use ($request) {
          $q->where('horario_inicio', '<', $request->horario_termino)
            ->where('horario_termino', '>', $request->horario_inicio);
        });
    });

    $request->validate(
      // Regras de validação
      [
        'tema' => 'required|string|max:255',
        'vagas_max' => 'required|numeric|gt:4',
        'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
        'horario_inicio' => 'required|date_format:H:i',
        'horario_termino' => 'required|date_format:H:i|after:horario_inicio',
        'descricao' => 'required|string',
        'email_palestrante' => 'required|email|max:255',
        'telefone_palestrante' => 'required|string|max:20',

        // Regras que podem ter conflito
        'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
        'local' => ['required', 'string', $uniqueRule],
      ],
      // Mensagens customizadas
      [
        'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
        'local.unique' => 'Este local já está reservado em um evento no momento.',
        'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
        'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
      ]
    );

    $event = Event::create($request->all());

    return response()->json($event, 201);
  }

  public function show(Event $event)
  {
    return response()->json($event);
  }

  public function update(Request $request, Event $event)
  {
    $validate = $request->validate([
      'tema' => [
        'sometimes',
        'required',
        'string',
        'max:255',
        Rule::unique('events')->where(function ($query) use ($request) {
          return $query->where('data', $request->data)
            ->where('horario_inicio', $request->horario_inicio);
        })->ignore($event->id),
      ],
      'palestrante' => [
        'required',
        'string',
        'max:255',
        Rule::unique('events')->where(function ($query) use ($request) {
          return $query->where('data', $request->data)
            ->where('horario_inicio', $request->horario_inicio);
        })->ignore($event->id),
      ],
      'email_palestrante' => 'required|string|max:255',
      'telefone_palestrante' => 'required|string|max:20',
      'vagas_max' => 'sometimes|required|numeric|gt:4',
      'horario_inicio' => 'sometimes|required|date_format:H:i',
      'horario_termino' => 'sometimes|required|date_format:H:i|after:horario_inicio',
      'descricao' => 'sometimes|required|string',
      'local' => [
        'sometimes',
        'required',
        'string',
        Rule::unique('events')->where(function ($query) use ($request) {
          return $query->where('data', $request->data)
            ->where('horario_inicio', $request->horario_inicio);
        })->ignore($event->id),
      ],
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
