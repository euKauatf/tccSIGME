<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\SorteioController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\PalestranteController; 

// Autenticação
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/verify-password', [AuthController::class, 'verifyPassword']);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/user', function (Request $request) {
    return $request->user()->load('eventos');
  });
});

// Eventos
Route::apiResource('event', EventController::class);
Route::get('/event/{event}/export-pdf', [EventController::class, 'exportPdf'])
  ->middleware('auth:sanctum');
Route::post('/event/{event}/subscribe', [InscricaoController::class, 'store'])
  ->middleware('auth:sanctum');
Route::delete('/event/{event}/unsubscribe', [InscricaoController::class, 'destroy'])
  ->middleware('auth:sanctum');

// Alunos
Route::get('/alunos', [\App\Http\Controllers\UserController::class, 'indexAlunos'])
  ->middleware('auth:sanctum');

// Audit Logs
Route::get('/audit-logs', [AuditLogController::class, 'index'])
  ->middleware('auth:sanctum');
Route::delete('/audit-logs/clear', [AuditLogController::class, 'clearLogs'])
  ->middleware('auth:sanctum');

// Sorteio
Route::post('/sorteio', [SorteioController::class, 'realizarSorteio'])
  ->middleware('auth:sanctum');
Route::post('/sorteio/clear', [SorteioController::class, 'clearSorteio'])
  ->middleware('auth:sanctum');

// Palestrantes
Route::get('/palestrantes', [PalestranteController::class, 'index'])
  ->middleware('auth:sanctum');
Route::post('/palestrantes', [PalestranteController::class, 'store'])
  ->middleware('auth:sanctum');
Route::get('/palestrantes/search', [PalestranteController::class, 'search'])
  ->middleware('auth:sanctum');
Route::get('/palestrantes/{palestrante}', [PalestranteController::class, 'show'])
  ->middleware('auth:sanctum');
Route::put('/palestrantes/{palestrante}', [PalestranteController::class, 'update'])
  ->middleware('auth:sanctum');
Route::delete('/palestrantes/{palestrante}', [PalestranteController::class, 'destroy'])
  ->middleware('auth:sanctum');

// Inscrição pública (sem login)
Route::post('/inscricao/marcar-presenca', [InscricaoController::class, 'marcarPresenca']);
