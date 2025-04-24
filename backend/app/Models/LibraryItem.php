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
    
    public function borrowingRequests()
    {
        return $this->hasMany(BookBorrowingRequest::class);
    }
    
    public function activeBorrowings()
    {
        return $this->borrowingRequests()->where('status', 'approved')->whereNull('return_date');
    }
    
    public function availableQuantity()
    {
        $borrowedCount = $this->activeBorrowings()->count();
        return $this->quantity - $borrowedCount;
    }
    
    public function isAvailableForBorrowing()
    {
        return $this->availableQuantity() > 0;
    }
}