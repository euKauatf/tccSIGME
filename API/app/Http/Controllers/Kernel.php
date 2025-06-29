// em app/Http/Kernel.php

protected $middlewareGroups = [
    'web' => [
        // ... middlewares do grupo 'web', não precisa mexer aqui ...
    ],

    'api' => [
        // vvv ESTA É A LINHA QUE ESTÁ FALTANDO vvv
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];