<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser atribuídos em massa.
     */
    protected $fillable = [
        'user_id',
        'action',
        'auditable_id',
        'auditable_type',
        'details',
    ];
    
    /**
     * ✅ A LINHA MAIS IMPORTANTE - Garante a conversão automática para JSON.
     * É muito provável que esta propriedade esteja faltando no seu arquivo.
     */
    protected $casts = [
        'details' => 'array',
    ];

    /**
     * Relação para pegar o objeto relacionado (um Evento, um User, etc.)
     */
    public function auditable()
    {
        return $this->morphTo();
    }

    /**
     * Relação para pegar o usuário que realizou a ação
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}