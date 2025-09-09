<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Local extends Model
{
    protected $table = 'locais';

    protected $fillable = [
        'name',
        'capacidade',
    ];

    public $timestamps = false;

    public function eventos(): HasMany
    {
        return $this->hasMany(Evento::class, 'local_id');
    }
}

