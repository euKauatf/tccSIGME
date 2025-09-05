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
        $uniqueRule = Rule::unique('events')->where(function ($query) use ($request) {
            return $query->where('data', $request->data)
                ->where(function ($q) use ($request) {
                    $q->where('horario_inicio', '<', $request->horario_termino)
                        ->where('horario_termino', '>', $request->horario_inicio);
                });
        });

        $validatedData = $request->validate([
            'tema' => ['required', 'string', 'max:255', $uniqueRule],
            'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
            'local' => ['required', 'string', 'max:255', $uniqueRule],
            'email_palestrante' => 'required|email|max:255',
            'telefone_palestrante' => 'required|string|max:20',
            'vagas_max' => 'required|numeric|gt:4',
            'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
            'horario_inicio' => 'required|date_format:H:i',
            'horario_termino' => 'required|date_format:H:i|after:horario_inicio',
            'descricao' => 'required|string|max:400',
        ], $this->messages());

        $event = Event::create($validatedData);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $uniqueRule = Rule::unique('events')->where(function ($query) use ($request) {
            return $query->where('data', $request->data)
                ->where(function ($q) use ($request) {
                    if ($request->horario_inicio && $request->horario_termino) {
                        $q->where('horario_inicio', '<', $request->horario_termino)
                          ->where('horario_termino', '>', $request->horario_inicio);
                    }
                });
        })->ignore($event->id);

        $validatedData = $request->validate([
            'tema' => ['sometimes', 'required', 'string', 'max:255', $uniqueRule],
            'palestrante' => ['sometimes', 'required', 'string', 'max:255', $uniqueRule],
            'local' => ['sometimes', 'required', 'string', 'max:255', $uniqueRule],
            'email_palestrante' => 'sometimes|required|email|max:255',
            'telefone_palestrante' => 'sometimes|required|string|max:20',
            'vagas_max' => 'sometimes|required|numeric|gt:4',
            'data' => 'sometimes|required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
            'horario_inicio' => 'sometimes|required|date_format:H:i',
            'horario_termino' => 'sometimes|required|date_format:H:i|after:horario_inicio',
            'descricao' => 'sometimes|required|string|max:400',
        ], $this->messages());

        $event->update($validatedData);

        return response()->json($event, 200);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }

    private function messages()
    {
        return [
            'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
            'local.unique' => 'Este local já está reservado em um evento no momento.',
            'tema.unique' => 'Já existe um evento com esse tema nesta data e horário.',
            'horario_termino.after' => 'O horário de término deve ser depois do horário de início.',
            'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
            'data.in' => 'A data deve ser uma das seguintes: Segunda, Terça, Quarta, Quinta ou Sexta.',
        ];
    }
}
