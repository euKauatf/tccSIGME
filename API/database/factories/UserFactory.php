<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            
            // --- INÍCIO DAS MODIFICAÇÕES ---
            'matricula' => fake()->unique()->numerify('##########'), // Gera uma matrícula numérica única de 10 dígitos
            'cpf' => fake()->unique()->numerify('###.###.###-##'), // Gera um CPF único no formato correto
            'tipo' => 'aluno', // Define 'aluno' como padrão para usuários criados em massa
            // --- FIM DAS MODIFICAÇÕES ---
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}