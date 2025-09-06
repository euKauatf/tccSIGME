<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'tema',
        'palestrante',
        'email_palestrante',
        'telefone_palestrante',
        'vagas_max',
        'data',
        'horario_inicio',
        'horario_termino',
        'descricao',
        'local',
    ];

    protected $appends = ['vagas_restantes'];

    protected $casts = [
        'data' => 'string',
        'horario_inicio' => 'datetime:H:i',
        'horario_termino' => 'datetime:H:i',
    ];

    /**
     * Relacionamento com usuários (inscrições)
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'inscricoes', 'events_id', 'user_id')
                    ->withPivot('status', 'rodada')
                    ->withTimestamps();
    }

    /**
     * Relacionamento com palestrante
     */
    public function palestrante(): BelongsTo
    {
        // Assumindo que a coluna na tabela events seja 'palestrante_id'
        return $this->belongsTo(Palestrante::class, 'palestrante_id', 'id');
    }

    /**
     * Vagas restantes do evento
     */
    public function getVagasRestantesAttribute()
    {
        return $this->vagas_max - $this->users()->wherePivot('status', 'contemplado')->count();
    }
}
