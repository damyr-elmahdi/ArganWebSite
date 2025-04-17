<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // backend/app/Models/Event.php
    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'creator_id',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function addToCalendar()
    {
        // Implementation for adding to calendar
    }

    public function notify()
    {
        // Implementation for event notifications
    }
}
