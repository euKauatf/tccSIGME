<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    // Função de registro de usuário
    public function register(RegisterRequest $request)
    {
        // As validações já foram feitas no RegisterRequest
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'matricula' => $request->matricula,
            'cpf' => $request->cpf,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // Função de login de usuário
    public function login(LoginRequest $request)
    {
        // A validação do login já foi realizada no LoginRequest
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    // Função de logout do usuário
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}
