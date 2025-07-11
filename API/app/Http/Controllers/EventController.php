<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    /**
     * Retorna todos os eventos.
     */
    public function index()
    {
        // Usando o model 'Event' e o campo correto 'horario_inicio'
        return Event::orderBy('horario_inicio', 'desc')->get();
    }

    /**
     * Cria um novo evento no banco de dados.
     */
    public function store(Request $request)
    {
        // 2. O método validate() já retorna os dados validados.
        $validatedData = $request->validate([
            'tema' => 'required|string|max:255',
            'palestrante' => 'required|string|max:255',
            'vagas_max' => 'required|numeric',
            'horario_inicio' => 'required|date',
            'horario_termino' => 'required|date|after_or_equal:horario_inicio',
            'descricao' => 'required|string',
            'local' => 'required|string',
        ]);

        // 3. Removido o 'if ($validate->fails())', pois o validate() já trata o erro.
        // 4. Usar os dados validados para criar o evento, é mais seguro.
        $event = Event::create($validatedData);
        
        return response()->json($event, 201);
    }

    /**
     * Exibe um evento específico.
     */
    public function show(Event $event) // Usando o model 'Event'
    {
        return response()->json($event);
    }
    
    /**
     * Atualiza um evento existente.
     */
    public function update(Request $request, Event $event) // Usando o model 'Event'
    {
        // 5. Corrigida a sintaxe da validação, o "erro da vírgula fantasma".
        $validate = $request->validate([
            'tema' => 'sometimes|required|string|max:255',
            'palestrante' => 'sometimes|required|string|max:255',
            'vagas_max' => 'sometimes|required|numeric',
            'horario_inicio' => 'sometimes|required|date',
            'horario_termino' => 'sometimes|required|date|after_or_equal:horario_inicio',
            'descricao' => 'sometimes|required|string',
            'local' => 'sometimes|required|string',
        ]);

        $event->update($validate);

        // 6. Adicionado o ponto e vírgula que faltava.
        return response()->json($event, 200);
    }

    /**
     * Deleta um evento.
     */
    public function destroy(Event $event) // Usando o model 'Event'
    {
        $event->delete();
        return response()->json(null, 204);
    }
}