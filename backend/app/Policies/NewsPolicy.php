<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class NewsPolicy
{
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
    public function update(User $user, News $news): bool
    {
        return $user->role === 'administrator' || $user->id === $news->author_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, News $news): bool
    {
        return $user->role === 'administrator' || $user->id === $news->author_id;
    }

    /**
     * Determine whether the user can publish the model.
     */
    public function publish(User $user, News $news): bool
    {
        return $user->role === 'administrator' || $user->id === $news->author_id;
    }

    /**
     * Determine whether the user can archive the model.
     */
    public function archive(User $user, News $news): bool
    {
        return $user->role === 'administrator' || $user->id === $news->author_id;
    }

    /**
     * Determine whether the user can view an unpublished news item.
     */
    public function view(User $user, News $news): bool
    {
        return $user->role === 'administrator' || $user->id === $news->author_id;
    }
}