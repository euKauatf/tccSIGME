<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Palestrante extends Model
{
    protected $fillable = [
        'name',
        'email',
        'telefone',
    ];

    /**
     * Um palestrante pode ter muitos eventos
     */
    public function eventos(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
