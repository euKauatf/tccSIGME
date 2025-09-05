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

  /**
   * @var array<string, string>
   */
  protected $casts = [
    'data' => 'string',
    'horario_inicio' => 'datetime:H:i',
    'horario_termino' => 'datetime:H:i',
  ];
  /**
   * @return BelongsToMany
   */
  public function users(): BelongsToMany
  {
    return $this->belongsToMany(User::class, 'inscricoes', 'events_id', 'user_id')
      ->withPivot('status', 'rodada')
      ->withTimestamps();
  }
}