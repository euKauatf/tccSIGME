<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
  public function index()
  {
    // z
    $logs = AuditLog::with(['user', 'auditable'])->latest()->paginate(25);
    return response()->json($logs);
  }

  public function clearLogs()
  {
    if (Auth::user()->tipo !== 'adm') {
      return response()->json(['message' => 'Acesso negado.'], 403);
    }
    // O método truncate() é a forma mais eficiente de apagar todas as
    // linhas de uma tabela.
    AuditLog::truncate();

    // Retorna uma resposta de sucesso
    return response()->json(['message' => 'Log de auditoria limpo com sucesso.'], 200);
  }
}
