<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon; // <-- AQUI ESTÁ A CORREÇÃO!

class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        $locais = ['Auditório Principal', 'Sala 101', 'Laboratório de Informática', 'Pátio Central', 'Sala Multimídia'];

        $horarioInicio = fake()->time('H:i', '18:00');

        return [
            'tema' => fake()->sentence(3), // Gera um tema com 3 palavras
            'vagas_max' => fake()->numberBetween(20, 50),
            'data' => fake()->randomElement($diasDaSemana),
            'horario_inicio' => $horarioInicio,
            'horario_termino' => Carbon::createFromFormat('H:i', $horarioInicio)->addHours(2)->format('H:i'),
            'descricao' => fake()->paragraph(2), // Gera uma descrição com 2 parágrafos
            'email_palestrante' => fake()->safeEmail(),
            'telefone_palestrante' => fake()->phoneNumber(),
            'palestrante' => fake()->name(),
            'local' => fake()->randomElement($locais),
        ];
    }
}