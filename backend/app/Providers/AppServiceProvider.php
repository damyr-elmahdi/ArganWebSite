<?php

namespace App\Providers;

use App\Console\Scheduling\PublishScheduledNewsTask;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\PdfAuthentication; // Add this import
use Illuminate\Console\Scheduling\Schedule;

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
        // Register middleware aliases
        Route::aliasMiddleware('role', RoleMiddleware::class);
        Route::aliasMiddleware('pdf.auth', PdfAuthentication::class); // Add this line

        // Load your route files
        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        $this->app->booted(function () {
            $schedule = app(Schedule::class);
            app(PublishScheduledNewsTask::class)($schedule);
        });
    }
}