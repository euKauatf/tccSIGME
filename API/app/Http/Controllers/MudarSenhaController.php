<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class MudarSenhaController extends Controller
{
    public function updatePassword(Request $request)
    {
        
        $request->validate([
            'matricula' => 'required|string',
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

       
        $user = Auth::user();

       
        if ($user->matricula !== $request->matricula) {
            return response()->json([
                'message' => 'A matrícula informada não corresponde ao usuário logado.'
            ], 404);
        }
        
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json(['message' => 'A nova senha não pode ser igual à senha atual.'], 400);
        }   
       
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'message' => 'Senha atual incorreta.'
            ], 401);
        }

        
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Senha atualizada com sucesso!'
        ], 200);
    }
}
