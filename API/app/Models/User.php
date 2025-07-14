<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
    'matricula',
    'cpf',
    'tipo',
  ];

  /**
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
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
   * @return BelongsToMany
   */
  public function eventos(): BelongsToMany
  {
    return $this->belongsToMany(Event::class, 'inscricoes', 'user_id', 'events_id')
      ->withPivot('status')
      ->withTimestamps();
  }
}
