<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventFormRequest;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        return Event::orderBy('horario_inicio', 'desc')->get();
    }

    public function store(EventFormRequest $request)
    {
        // A validação já foi feita automaticamente
        $event = Event::create($request->all());

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(EventFormRequest $request, Event $event)
    {
        // Usando as regras de validação para update
        $validatedData = $request->updateRules($event);

        $event->update($validatedData);

        return response()->json($event, 200);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
