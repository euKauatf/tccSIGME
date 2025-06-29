<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    /**
     * Lida com o registro de um novo usuário.
     */
    public function register(Request $request)
    {
        // 1. Valida os dados que vieram do formulário do React
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'matricula' => ['required', 'string', 'max:255', 'unique:'.User::class],
            'cpf' => ['required', 'string', 'max:14', 'unique:'.User::class],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Cria o usuário no banco de dados, criptografando a senha
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'matricula' => $request->matricula,
            'cpf' => $request->cpf,
            'password' => Hash::make($request->password),
        ]);

        // 3. Gera um token de API para o novo usuário
        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        // 4. Retorna o token para o frontend
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Lida com a tentativa de login de um usuário.
     */
    public function login(Request $request)
    {
        // Tenta autenticar com o email e a senha fornecidos
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        // Se a autenticação for bem-sucedida, encontra o usuário
        $user = User::where('email', $request['email'])->firstOrFail();
        
        // Cria um novo token para a sessão de login
        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        // Retorna o token e os dados do usuário para o frontend
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Lida com o logout do usuário.
     */
    public function logout(Request $request)
    {
        // Invalida o token que foi usado para fazer esta requisição
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}