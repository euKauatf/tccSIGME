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
     * Lida com uma requisição de registro de um novo usuário.
     */
    public function register(Request $request)
    {
        // 1. Validação dos dados recebidos do formulário de registro.
        // O Laravel verifica se os dados seguem estas regras.
        // Se a validação falhar, ele automaticamente retorna um erro para o frontend.
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Se a validação passar, cria o novo usuário no banco de dados.
        // IMPORTANTE: A senha é criptografada com Hash::make() antes de ser salva.
        // Nunca salve senhas como texto puro!
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Gera um token de API para o usuário recém-criado usando o Laravel Sanctum.
        // Este token será usado pelo frontend para fazer requisições autenticadas.
        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        // 4. Retorna uma resposta JSON para o frontend com o token de acesso.
        return response()->json([
            'message' => 'Usuário registrado com sucesso!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Lida com uma requisição de login.
     */
    public function login(Request $request)
    {
        // 1. Pega apenas o email e a senha da requisição.
        $credentials = $request->only('email', 'password');

        // 2. Tenta autenticar o usuário.
        // O método Auth::attempt() faz a mágica: ele pega o email, busca o usuário,
        // criptografa a senha recebida e compara com a senha criptografada no banco.
        if (!Auth::attempt($credentials)) {
            // Se a autenticação falhar, retorna um erro 401 (Não Autorizado).
            return response()->json(['message' => 'Email ou senha inválidos'], 401);
        }

        // 3. Se a autenticação for bem-sucedida, pega a instância do usuário.
        $user = $request->user();

        // 4. Gera um novo token de API para este usuário.
        $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

        // 5. Retorna uma resposta JSON para o frontend com o token e os dados do usuário.
        return response()->json([
            'message' => 'Login realizado com sucesso!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Lida com uma requisição de logout.
     * Esta rota deve ser protegida pelo middleware 'auth:sanctum'.
     */
    public function logout(Request $request)
    {
        // Revoga (invalida) o token que foi usado para fazer esta requisição.
        // Isso efetivamente desloga o usuário da sessão atual.
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso!'
        ]);
    }
}