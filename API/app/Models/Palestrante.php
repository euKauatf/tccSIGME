<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Palestrante extends Model
{
    protected $fillable = [
    'name',
    'email',
    'telefone',
  ];

  public function eventos(): BelongsToMany
  {
    return $this->belongsToMany(Event::class, 'responsavel', 'palestrante_id', 'events_id')
      ->withTimestamps();
  }
}
