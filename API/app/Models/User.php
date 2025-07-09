<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 1. ESTA LINHA IMPORTA O PACOTE DE HABILIDADES DO SANCTUM

class User extends Authenticatable
{
    // 2. ESTA LINHA "USA" O PACOTE DE HABILIDADES, DANDO AO USER O "SUPERPODER" DE CRIAR TOKENS
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // 3. GARANTA QUE SEUS CAMPOS PERSONALIZADOS ESTÃO AQUI
    protected $fillable = [
        'name',
        'email',
        'password',
        'matricula',
        'cpf',
        'tipo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdm(): bool
    {
        return $this->tipo === 'adm';
    }
    
        /**
     * Relacionamento muitos-para-muitos com o modelo User.
     *
     * @return BelongsToMany
     */
    public function eventos(): BelongsToMany{
        return $this->belongsToMany(Eventos::class, 'inscricoes', 'evento_id', 'user_id')
            -withPivot('status')
            ->withTimestamps();
    }
}