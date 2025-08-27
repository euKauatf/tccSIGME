<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        // Permite que qualquer usuário faça o registro (sem verificações adicionais).
        return true;
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'matricula' => ['required', 'string', 'max:255', 'unique:users'],
            'cpf' => ['required', 'string', 'max:14', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    public function messages()
    {
        return [
            'matricula.unique' => 'Já existe uma conta com essa matrícula.',
            'cpf.unique' => 'Já existe uma conta com esse CPF.',
            'email.unique' => 'Já existe uma conta com esse e-mail.',
        ];
    }
}
