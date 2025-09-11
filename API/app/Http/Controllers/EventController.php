<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class EventController extends Controller
{
  /**
   * Lista todos os eventos.
   */
  public function index(): JsonResponse
  {
    $events = Event::orderBy('data')->orderBy('horario_inicio')->get();
    return response()->json($events);
  }

  /**
   * Armazena um novo evento no banco de dados.
   */
  public function store(Request $request): JsonResponse
  {
    // Regra para verificar conflitos de horário para um palestrante ou local
    $conflictRule = function ($query) use ($request) {
      return $query->where('data', $request->data)
        ->where('horario_inicio', '<', $request->horario_termino)
        ->where('horario_termino', '>', $request->horario_inicio);
    };

    $validatedData = $request->validate([
      'tema' => 'required|string|max:255',
      'vagas_max' => 'required|numeric|gt:4',
      'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
      'horario_inicio' => 'required|date_format:H:i',
      'horario_termino' => [
        'required',
        'date_format:H:i',
        'after:horario_inicio',
        function ($attribute, $value, $fail) use ($request) {
          $inicio = Carbon::createFromFormat('H:i', $request->horario_inicio);
          $termino = Carbon::createFromFormat('H:i', $value);
          if ($inicio->diffInMinutes($termino) < 45) {
            $fail("O evento deve ter uma duração mínima de 45 minutos.");
          }
        }
      ],
      'descricao' => 'required|string',
      'palestrante' => ['required', 'string', 'max:255', Rule::unique('events')->where($conflictRule)],
      'email_palestrante' => 'email|max:255',
      'telefone_palestrante' => 'string|max:20',
      'local' => ['required', 'string', Rule::unique('events')->where($conflictRule)],
    ], [
      'palestrante.unique' => 'Este palestrante já está ocupado noutro evento neste horário.',
      'local.unique' => 'Este local já está reservado para outro evento neste horário.',
      'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
      'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
    ]);

    $event = Event::create($validatedData);
    return response()->json($event, 201);
  }

  /**
   * Exibe um evento específico.
   */
  public function show(Event $event): JsonResponse
  {
    return response()->json($event);
  }

  /**
   * Atualiza um evento existente.
   */
  public function update(Request $request, Event $event): JsonResponse
  {
    $conflictRule = function ($query) use ($request) {
      return $query->where('data', $request->data)
        ->where('horario_inicio', '<', $request->horario_termino)
        ->where('horario_termino', '>', $request->horario_inicio);
    };

    $validatedData = $request->validate([
      'tema' => 'sometimes|required|string|max:255',
      'vagas_max' => 'sometimes|required|numeric|gt:4',
      'data' => 'sometimes|required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
      'horario_inicio' => 'sometimes|required|date_format:H:i',
      'horario_termino' => ['sometimes', 'required', 'date_format:H:i', 'after:horario_inicio'],
      'descricao' => 'sometimes|required|string',
      'palestrante' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('events')->where($conflictRule)->ignore($event->id)],
      'email_palestrante' => 'sometimes|email|max:255',
      'telefone_palestrante' => 'sometimes|string|max:20',
      'local' => ['sometimes', 'required', 'string', Rule::unique('events')->where($conflictRule)->ignore($event->id)],
    ]);

    $event->update($validatedData);
    return response()->json($event);
  }

  /**
   * Remove um evento do banco de dados.
   */
  public function destroy(Event $event): JsonResponse
  {
    $event->delete();
    return response()->json(null, 204);
  }

  /**
   * Gera um PDF com a lista de alunos selecionados para o evento.
   */
  public function exportPdf(Event $event)
  {
    $event->load(['users' => function ($query) {
      $query->wherePivot('status', 'contemplado')->orderBy('name', 'asc');
    }]);

    if ($event->users->isEmpty()) {
      return response()->json(['message' => 'Não há alunos selecionados neste evento para gerar uma lista.'], 404);
    }

    $data = [
      'event' => $event,
      'alunos' => $event->users,
    ];

    $pdf = Pdf::loadView('pdf.lista_alunos', $data);
    return $pdf->download('lista-alunos-' . str_replace(' ', '-', $event->tema) . '.pdf');
  }
}
