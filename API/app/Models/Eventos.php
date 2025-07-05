<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Evento extends Model
{
    use HasFactory;

    /**
     * @var array<int, string>
     */
    //lista de atributos que podem ser preenchidos em massa
    protected $fillable = [
        'tema',
        'palestrante',
        'vagas_max',
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
        'horario_inicio' => 'datetime',
        'horario_termino' => 'datetime',
    ];
}