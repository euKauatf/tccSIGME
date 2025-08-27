<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventFormRequest extends FormRequest
{
    /**
     * Determina se o usuário tem permissão para fazer essa requisição.
     *
     * @return bool
     */
    public function authorize()
    {
        // Adicione lógica de autorização aqui, caso necessário
        return true;
    }

    /**
     * Obtém as regras de validação para a requisição.
     *
     * @return array
     */
    public function rules()
    {
        // Se a requisição for para atualização, use uma regra para ignorar o próprio evento
        $uniqueRule = Rule::unique('events')->where(function ($query) {
            return $query->where('data', $this->data)
                ->where(function ($q) {
                    $q->where('horario_inicio', '<', $this->horario_termino)
                      ->where('horario_termino', '>', $this->horario_inicio);
                });
        });

        return [
            'tema' => 'required|string|max:255',
            'vagas_max' => 'required|numeric|gt:4',
            'data' => 'required|string|in:Segunda,Terça,Quarta,Quinta,Sexta',
            'horario_inicio' => 'required|date_format:H:i',
            'horario_termino' => 'required|date_format:H:i|after:horario_inicio',
            'descricao' => 'required|string',
            'email_palestrante' => 'required|email|max:255',
            'telefone_palestrante' => 'required|string|max:20',

            // Regras que podem ter conflito
            'palestrante' => ['required', 'string', 'max:255', $uniqueRule],
            'local' => ['required', 'string', $uniqueRule],
        ];
    }

    /**
     * Mensagens personalizadas para as falhas de validação.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'palestrante.unique' => 'Este palestrante já está ocupado em um evento no momento.',
            'local.unique' => 'Este local já está reservado em um evento no momento.',
            'horario_termino.after' => 'O horário de término deve ser após o horário de início.',
            'vagas_max.gt' => 'O número de vagas deve ser de, no mínimo, 5.',
        ];
    }

    /**
     * Regras de validação para a atualização do evento.
     * 
     * @param $event
     * @return array
     */
    public function updateRules($event)
    {
        $uniqueRule = Rule::unique('events')->where(function ($query) {
            return $query->where('data', $this->data)
                ->where('horario_inicio', $this->horario_inicio);
        })->ignore($event->id);

        return [
            'tema' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                $uniqueRule,
            ],
            'palestrante' => [
                'required',
                'string',
                'max:255',
                $uniqueRule,
            ],
            'email_palestrante' => 'required|string|max:255',
            'telefone_palestrante' => 'required|string|max:20',
            'vagas_max' => 'sometimes|required|numeric|gt:4',
            'horario_inicio' => 'sometimes|required|date_format:H:i',
            'horario_termino' => 'sometimes|required|date_format:H:i|after:horario_inicio',
            'descricao' => 'sometimes|required|string',
            'local' => [
                'sometimes',
                'required',
                'string',
                $uniqueRule,
            ],
        ];
    }
}
