<?php



use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: [__DIR__.'/../routes/web.php', __DIR__.'/../routes/admin.php'], 
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Add Sanctum middleware to API group (CRITICAL for SPA authentication)
        $middleware->group('api', [
            EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
        
        // Add CORS to API middleware stack
        $middleware->api(prepend: [
            HandleCors::class,
        ]);
        
        // Add CORS to web middleware stack
        $middleware->web(append: [
            HandleCors::class,
        ]);
        
        // Register aliases
        $middleware->alias([
            'admin.guest' => \App\Http\Middleware\AdminGuest::class,
            'admin.auth' => \App\Http\Middleware\AdminAuth::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

// use Illuminate\Foundation\Application;
// use Illuminate\Foundation\Configuration\Exceptions;
// use Illuminate\Foundation\Configuration\Middleware;
// use Illuminate\Http\Middleware\HandleCors;
// return Application::configure(basePath: dirname(__DIR__))
//     ->withRouting(
//         web:[ __DIR__.'/../routes/web.php',
//          __DIR__.'/../routes/admin.php'], 
//         api: __DIR__.'/../routes/api.php',
//         commands: __DIR__.'/../routes/console.php',
//         health: '/up',
//     )
//     ->withMiddleware(function (Middleware $middleware): void {
//         // $middleware->append(HandleCors::class);
//           $middleware->api(append: [
//             HandleCors::class,
//         ]);
        
//         // Add CORS to web middleware stack
//         $middleware->web(append: [
//             HandleCors::class,
//         ]);
//         $middleware->alias([
//             'admin.guest' => \App\Http\Middleware\AdminGuest::class,
//             'admin.auth' => \App\Http\Middleware\AdminAuth::class,
//         ]);
//     })
    
//     ->withExceptions(function (Exceptions $exceptions): void {
//         //
//     })->create();
