<?php

namespace App\Http\Controllers;

use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;

class LocalController extends Controller
{
    /**
     * Retorna todos os locais, ordenados por nome.
     */
    public function index(): JsonResponse
    {
        $locais = Local::orderBy('name')->get();
        return response()->json($locais);
    }

    /**
     * Cria um novo local.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:locais',
            'capacidade' => 'required|integer|min:1',
        ]);

        $local = Local::create($validatedData);

        return response()->json($local, 201);
    }

    /**
     * Retorna um local específico (Route Model Binding).
     */
    public function show(Local $local): JsonResponse
    {
        return response()->json($local);
    }

    /**
     * Atualiza um local específico.
     */
    public function update(Request $request, Local $local): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('locais')->ignore($local->id)],
            'capacidade' => 'required|integer|min:1',
        ]);

        $local->update($validatedData);

        return response()->json($local);
    }

    /**
     * Exclui um local.
     */
    public function destroy(Local $local): JsonResponse
    {
        try {
            $local->delete();
            return response()->json(null, 204);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Não é possível excluir: existem eventos vinculados a este local.'
            ], 400);
        }
    }

    /**
     * Busca locais pelo nome.
     */
    public function search(Request $request): JsonResponse
    {
        $term = $request->input('term');
        $query = Local::query();

        if ($term) {
            $query->where('name', 'LIKE', "%{$term}%");
        }

        $locais = $query->limit(10)->get(['id', 'name', 'capacidade']);
        return response()->json($locais);
    }
}
