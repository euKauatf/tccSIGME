
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Nosso controller de autenticação
use App\Http\Controllers\EventController;

// Rotas Públicas (não precisam de token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('event', EventController::class);

// Rotas Protegidas (precisam de um token válido para serem acessadas)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Rota de exemplo para buscar os dados do usuário logado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

