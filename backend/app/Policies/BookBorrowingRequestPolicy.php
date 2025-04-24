<?php

namespace App\Policies;

use App\Models\BookBorrowingRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookBorrowingRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isLibrarian() || $user->isAdministrator();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BookBorrowingRequest $request): bool
    {
        return $user->id === $request->student_id || 
               $user->isLibrarian() || 
               $user->isAdministrator();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isStudent();
    }

    /**
     * Determine whether the user can approve borrowing requests.
     */
    public function approve(User $user, BookBorrowingRequest $request): bool
    {
        return ($user->isLibrarian() || $user->isAdministrator()) && 
                $request->status === 'pending';
    }

    /**
     * Determine whether the user can reject borrowing requests.
     */
    public function reject(User $user, BookBorrowingRequest $request): bool
    {
        return ($user->isLibrarian() || $user->isAdministrator()) && 
                $request->status === 'pending';
    }

    /**
     * Determine whether the user can mark a book as returned.
     */
    public function markReturned(User $user, BookBorrowingRequest $request): bool
    {
        return ($user->isLibrarian() || $user->isAdministrator()) && 
                $request->status === 'approved' && 
                $request->return_date === null;
    }
}