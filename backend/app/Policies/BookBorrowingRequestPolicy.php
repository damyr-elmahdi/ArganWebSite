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
        return true; // Everyone can view a list of requests (filtered by permissions)
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Users can view their own requests, librarians and admins can view all requests
        return $user->id === $bookBorrowingRequest->user_id || 
               $user->isLibrarian() || 
               $user->isAdministrator();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only students can make borrowing requests
        return $user->isStudent();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Only librarians and admins can update borrowing requests
        return $user->isLibrarian() || $user->isAdministrator();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Students can cancel their own pending requests
        // Librarians and administrators can delete any request
        return ($user->id === $bookBorrowingRequest->user_id && $bookBorrowingRequest->status === 'pending') ||
               $user->isLibrarian() || 
               $user->isAdministrator();
    }

    /**
     * Determine whether the user can approve requests.
     */
    public function approve(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Only librarians and admins can approve borrowing requests
        return ($user->isLibrarian() || $user->isAdministrator()) &&
               $bookBorrowingRequest->status === 'pending';
    }

    /**
     * Determine whether the user can reject requests.
     */
    public function reject(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Only librarians and admins can reject borrowing requests
        return ($user->isLibrarian() || $user->isAdministrator()) &&
               $bookBorrowingRequest->status === 'pending';
    }

    /**
     * Determine whether the user can mark a book as returned.
     */
    public function return(User $user, BookBorrowingRequest $bookBorrowingRequest): bool
    {
        // Only librarians and admins can mark books as returned
        return ($user->isLibrarian() || $user->isAdministrator()) &&
               $bookBorrowingRequest->status === 'approved' &&
               $bookBorrowingRequest->return_date === null;
    }
}