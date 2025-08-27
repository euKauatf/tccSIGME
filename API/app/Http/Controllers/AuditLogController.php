<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    /**
     * Exibe a lista de logs de auditoria.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Carrega os logs de auditoria com os relacionamentos (user e auditable)
        $logs = AuditLog::with(['user', 'auditable'])->latest()->paginate(25);

        // Retorna os logs em formato JSON
        return response()->json($logs);
    }

    /**
     * Limpa todos os logs de auditoria.
     * Apenas usuários com o tipo 'adm' têm permissão para limpar os logs.
     * 
     * @return JsonResponse
     */
    public function clearLogs(): JsonResponse
    {
        // Verifica se o usuário tem permissão para limpar os logs
        if (Auth::user()->tipo !== 'adm') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        // Limpa todos os logs de auditoria
        AuditLog::truncate();

        // Retorna uma resposta de sucesso
        return response()->json(['message' => 'Log de auditoria limpo com sucesso.'], 200);
    }
}
