<?php

namespace App\Policies;

use App\Models\Librarian;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LibrarianPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'administrator';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Librarian $librarian): bool
    {
        return $user->role === 'administrator' || $user->id === $librarian->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'administrator';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Librarian $librarian): bool
    {
        return $user->role === 'administrator' || $user->id === $librarian->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Librarian $librarian): bool
    {
        return $user->role === 'administrator' && $user->id !== $librarian->user_id;
    }

    /**
     * Determine whether the user can manage librarians.
     */
    public function manageLibrarians(User $user): bool
    {
        return $user->role === 'administrator';
    }
}