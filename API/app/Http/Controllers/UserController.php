<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * UserController
 *
 * Controlador para gerenciar usuários.
 */

class UserController extends Controller
{
    public function indexAlunos(){
        $alunos = User::where('tipo', 'aluno')
            ->with(['eventos' => function ($query) {
                $query->select('events.id', 'events.tema', 'events.data');
            }])
            ->select('id', 'name', 'matricula')
            ->orderBy('name', 'asc')
            ->get();
            
        return response()->json($alunos, 200);
    }
}
