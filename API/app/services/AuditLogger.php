<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditLogger
{
    public static function log(User $user, string $action, Model $auditable = null, array $details = [])
    {
        AuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'auditable_id' => $auditable ? $auditable->id : null,
            'auditable_type' => $auditable ? get_class($auditable) : null,
            'details' => $details,
        ]);
    }
}