<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'matricula' => ['required', 'string', 'max:255', 'unique:' . User::class],
      'cpf' => ['required', 'string', 'max:14', 'unique:' . User::class],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
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

  public function login(Request $request)
  {
    if (!Auth::attempt($request->only('email', 'password'))) {
      return response()->json(['message' => 'Credenciais inválidas'], 401);
    }

    $user = User::where('email', $request['email'])->firstOrFail();

    $token = $user->createToken('auth_token_for_' . $user->name)->plainTextToken;

    return response()->json([
      'access_token' => $token,
      'token_type' => 'Bearer',
      'user' => $user
    ]);
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logout realizado com sucesso']);
  }
}
