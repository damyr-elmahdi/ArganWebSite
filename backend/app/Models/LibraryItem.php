<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'category',
        'available',
        'due_date',
    ];

    protected $casts = [
        'available' => 'boolean',
        'due_date' => 'date',
    ];
    
    public function checkAvailability()
    {
        return $this->available;
    }
    
    public function getCheckoutProcedure()
    {
        return "Visit the library during opening hours and present your student ID.";
    }
}