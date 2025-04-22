<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create events.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user)
    {
        // Allow administrators to create events
        return $user->role === 'administrator';
        
        // Or adjust this logic to match your requirements:
        // return $user->role === 'administrator' || $user->role === 'teacher';
    }

    /**
     * Determine whether the user can update the event.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Event  $event
     * @return bool
     */
    public function update(User $user, Event $event)
    {
        // Allow event creator or administrator to update
        return $user->id === $event->creator_id || $user->role === 'administrator';
    }

    /**
     * Determine whether the user can delete the event.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Event  $event
     * @return bool
     */
    public function delete(User $user, Event $event)
    {
        // Allow event creator or administrator to delete
        return $user->id === $event->creator_id || $user->role === 'administrator';
    }
}