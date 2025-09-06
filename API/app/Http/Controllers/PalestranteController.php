<?php

namespace App\Http\Controllers;

use App\Models\Palestrante;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PalestranteController extends Controller
{
    /**
     * Retorna todos os palestrantes, ordenados por nome.
     */
    public function index(): JsonResponse
    {
        $palestrantes = Palestrante::orderBy('name')->get();
        return response()->json($palestrantes);
    }

    /**
     * Cria um novo palestrante.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:palestrantes',
            'telefone' => 'required|string|max:20',
        ]);

        $palestrante = Palestrante::create($validatedData);

        return response()->json($palestrante, 201);
    }

    /**
     * Retorna um palestrante específico (Route Model Binding).
     */
    public function show(Palestrante $palestrante): JsonResponse
    {
        return response()->json($palestrante);
    }

    /**
     * Atualiza um palestrante específico.
     */
    public function update(Request $request, Palestrante $palestrante): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','string','email','max:255', Rule::unique('palestrantes')->ignore($palestrante->id)],
            'telefone' => 'required|string|max:20',
        ]);

        $palestrante->update($validatedData);

        return response()->json($palestrante);
    }

    /**
     * Exclui um palestrante.
     */
    public function destroy(Palestrante $palestrante): JsonResponse
    {
        try {
            $palestrante->delete();
            return response()->json(null, 204);
        } catch (\Illuminate\Database\QueryException $e) {
            // Caso o palestrante esteja vinculado a eventos
            return response()->json([
                'error' => 'Não é possível excluir: existem eventos vinculados a este palestrante.'
            ], 400);
        }
    }

    /**
     * Busca palestrantes pelo nome.
     */
    public function search(Request $request): JsonResponse
    {
        $term = $request->input('term');
        $query = Palestrante::query();

        if ($term) {
            $query->where('name', 'LIKE', "%{$term}%");
        }

        $palestrantes = $query->limit(10)->get(['id', 'name', 'email']);
        return response()->json($palestrantes);
    }
}
