
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\SorteioController;
use App\Http\Controllers\AuditLogController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('event', EventController::class);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/user', function (Request $request) {
    return $request->user()->load('eventos');
  })->middleware('auth:sanctum');
});

Route::post('/event/{event}/subscribe', [InscricaoController::class, 'store'])
  ->middleware('auth:sanctum');
Route::delete('/event/{event}/unsubscribe', [InscricaoController::class, 'destroy'])
  ->middleware('auth:sanctum');

Route::get('/alunos', [\App\Http\Controllers\UserController::class, 'indexAlunos'])
  ->middleware('auth:sanctum');

Route::get('/audit-logs', [AuditLogController::class, 'index'])
  ->middleware('auth:sanctum');
Route::delete('/audit-logs/clear', [AuditLogController::class, 'clearLogs'])
  ->middleware('auth:sanctum');

Route::post('/sorteio', [SorteioController::class, 'realizarSorteio'])
  ->middleware('auth:sanctum');

Route::post('/sorteio/clear', [SorteioController::class, 'clearSorteio'])
  ->middleware('auth:sanctum');
