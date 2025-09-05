<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon; // Importa a classe Carbon

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
            'vagas_max' => 'required|numeric|gt:4',
            'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
            'horario_inicio' => 'required|date_format:H:i',
            'horario_termino' => [
                'required', 'date_format:H:i', 'after:horario_inicio',
                function ($attribute, $value, $fail) use ($request) {
                    $inicio = Carbon::createFromFormat('H:i', $request->horario_inicio);
                    $termino = Carbon::createFromFormat('H:i', $value);
                    $duracaoMin = 45;
                    if ($inicio->diffInMinutes($termino) < $duracaoMin) {
                        $fail("O evento deve ter uma duração mínima de {$duracaoMin} minutos.");
                    }
                }
            ],
            'descricao' => 'required|string',
            'email_palestrante' => 'required|email|max:255',
            'telefone_palestrante' => 'required|string|max:20',
            'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
            'local' => ['required', 'string', $uniqueRule],
        ], [
            'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
            'local.unique' => 'Este local já está reservado em um evento no momento.',
            'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
            'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
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
        // ... (código do update)
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }

    public function exportPdf(Event $event){
        $event->load(['users' => function ($query) {
            $query->where('status', 'selecionado')->orderBy('name', 'asc');
        }]);

        if ($event->users->isEmpty()) {
            return response()->json(['message' => 'Não há alunos selecionados neste evento para gerar uma lista.'], 404);
        }

        $data = [
            'event' => $event,
            'alunos' => $event->users,
            'dataGeracao' => now()->format('d/m/Y H:i:s')
        ];

        $pdf = Pdf::loadView('pdf.lista_alunos', $data);
        return $pdf->download('lista-alunos-' . $event->tema . '.pdf');
    }
}

