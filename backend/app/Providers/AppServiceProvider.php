<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */

    
    public function boot(): void
    {
        // Register the 'role' middleware alias
        Route::aliasMiddleware('role', RoleMiddleware::class);
    
        // Load your route files
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
    }
    
}
