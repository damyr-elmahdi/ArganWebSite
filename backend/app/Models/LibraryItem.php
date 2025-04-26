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
        'quantity',
        'inventory_number',
        'description',
        'image_path',
        'available',
        'due_date',
    ];

    protected $casts = [
        'available' => 'boolean',
        'due_date' => 'date',
    ];
    
    // All borrowing-related methods have been removed
}