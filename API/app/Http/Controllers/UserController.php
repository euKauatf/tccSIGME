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
                          // Selecionamos apenas os campos que queremos dos eventos
                          $query->select('events.id', 'events.tema');
                      }])
            ->select('name', 'email', 'matricula')
            ->orderBy('name', 'asc')
            ->get();
            
        return response()->json($alunos, 200);
    }
}
