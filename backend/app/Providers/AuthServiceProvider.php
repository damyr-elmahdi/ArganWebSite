<?php

namespace App\Providers;

use App\Models\Event;
use App\Models\News;
use App\Models\Registration;
use App\Models\LibraryItem;
use App\Models\BookBorrowingRequest;
use App\Policies\EventPolicy;
use App\Policies\NewsPolicy;
use App\Policies\RegistrationPolicy;
use App\Policies\LibraryItemPolicy;
use App\Policies\BookBorrowingRequestPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Registration::class => RegistrationPolicy::class,
        News::class => NewsPolicy::class,
        Event::class => EventPolicy::class,
        LibraryItem::class => LibraryItemPolicy::class,
        BookBorrowingRequest::class => BookBorrowingRequestPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        //
    }
}