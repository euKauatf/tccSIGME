<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon; // É uma boa prática importar o Carbon no topo do arquivo

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
                'required',
                'date_format:H:i',
                'after:horario_inicio',
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
            'horario_termino' => [
                'sometimes',
                'required',
                'date_format:H:i',
                'after:horario_inicio',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->has('horario_inicio')) {
                        $inicio = Carbon::createFromFormat('H:i', $request->horario_inicio);
                        $termino = Carbon::createFromFormat('H:i', $value);
                        $duracaoMin = 45;
                        if ($inicio->diffInMinutes($termino) < $duracaoMin) {
                            $fail("O evento deve ter uma duração mínima de {$duracaoMin} minutos.");
                        }
                    }
                }
            ],
            'descricao' => 'sometimes|required|string',
            'local' => ['sometimes', 'required', 'string', $uniqueRule],
        ], [
             // Reutilizando as mensagens de erro relevantes.
            'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
            'local.unique' => 'Este local já está reservado em um evento no momento.',
            'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
            'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
        ]);

        $event->update($validatedData);

        return response()->json($event, 200);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }

    public function exportPdf(Event $event){
        //pega os alunos selecionados do evento em questao
        $event->load(['users' => function ($query) {
            $query->where('status', 'selecionado')->orderBy('name', 'asc');
        }]);

        //caso nao tenha alunos, nao da pra gerar a lista
        if ($event->users->isEmpty()) {
            return response()->json(['message' => 'Não há alunos selecionados neste evento para gerar uma lista.'], 404);
        }

        /*os dados que ficaram dentro do pdf serao o evento, os alunos e quando gerou (tudo aqui vai pra view blade
        em resources/views)*/
        $data = [
            'event' => $event,
            'alunos' => $event->users,
            'dataGeracao' => now()->format('d/m/Y H:i:s')
        ];

        $pdf = Pdf::loadView('pdf.lista_alunos', $data);

        // CORREÇÃO: Concatenação correta para o nome do arquivo
        return $pdf->download('lista-alunos-' . $event->tema . '.pdf');
    }
}