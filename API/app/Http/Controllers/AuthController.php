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
   * Registra um novo usuário.
   */
  public function register(Request $request)
  {
    // Validação do RegisterRequest movida para cá.
    $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'matricula' => ['required', 'string', 'max:255', 'unique:users'],
      'cpf' => ['required', 'string', 'max:14', 'unique:users'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ], [
      'matricula.unique' => 'Já existe uma conta com essa matrícula.',
      'cpf.unique' => 'Já existe uma conta com esse CPF.',
      'email.unique' => 'Já existe uma conta com esse e-mail.',
    ]);

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

  /**
   * Autentica um usuário existente.
   */
  public function login(Request $request)
  {
    // Validação do LoginRequest movida para cá.
    $request->validate([
      'email' => 'required|email|max:255',
      'password' => 'required|string',
    ], [
      'email.required' => 'O campo e-mail é obrigatório.',
      'password.required' => 'O campo senha é obrigatório.',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
      return response()->json(['message' => 'Credenciais inválidas'], 401);
    }

    // Mantendo a lógica original do controller.
    $user = User::where('email', $request['email'])->firstOrFail();

    $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

    return response()->json([
      'access_token' => $token,
      'token_type' => 'Bearer',
      'user' => $user,
    ]);
  }

  /**
   * Faz o logout do usuário.
   */
  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logout realizado com sucesso']);
  }

  public function verifyPassword(Request $request)
  {
    $request->validate([
      'password' => 'required|string',
    ]);

    $user = $request->user();

    if (!Hash::check($request->password, $user->password)) {
      return response()->json(['message' => 'Senha incorreta.'], 401);
    }

    return response()->json(['message' => 'Senha verificada com sucesso.'], 200);
  }
}
