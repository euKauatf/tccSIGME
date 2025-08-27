<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email|max:255',
            'password' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'O campo e-mail é obrigatório.',
            'password.required' => 'O campo senha é obrigatório.',
        ];
    }
}
