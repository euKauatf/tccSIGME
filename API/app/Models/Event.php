<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $table = 'event';
    
    //lista de atributos que podem ser preenchidos em massa
    protected $fillable = [
        'tema',
        'palestrante',
        'vagas_max',
        'data',
        'horario_inicio',
        'horario_termino',
        'descricao',
        'local',
    ];

    /**
     * @var array<string, string>
     */
    //diz que os horarios sao do tipo datetime
    protected $casts = [
        'data' => 'datetime',
        'horario_inicio' => 'datetime',
        'horario_termino' => 'datetime',
    ];
    /**
     * Relacionamento muitos-para-muitos com o modelo User.
     *
     * @return BelongsToMany
     */
    public function alunos(): BelongsToMany{
        return $this->belongsToMany(User::class, 'inscricoes', 'evento_id', 'user_id')
            ->withPivot('status')
            ->withTimestamps();
    }
}