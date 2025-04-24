<?php

namespace App\Policies;

use App\Models\LibraryItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LibraryItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Anyone can view the library catalog
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LibraryItem $libraryItem): bool
    {
        return true; // Anyone can view library item details
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isLibrarian() || $user->isAdministrator();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LibraryItem $libraryItem): bool
    {
        return $user->isLibrarian() || $user->isAdministrator();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LibraryItem $libraryItem): bool
    {
        return $user->isLibrarian() || $user->isAdministrator();
    }
}