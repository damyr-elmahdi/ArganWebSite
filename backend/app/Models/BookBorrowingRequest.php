<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookBorrowingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'library_item_id',
        'status',
        'borrow_date',
        'due_date',
        'return_date',
        'approved_by',
        'notes'
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function libraryItem()
    {
        return $this->belongsTo(LibraryItem::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Check if the request is still pending
    public function isPending()
    {
        return $this->status === 'pending';
    }

    // Check if the book is currently borrowed (approved but not returned)
    public function isActive()
    {
        return $this->status === 'approved' && $this->return_date === null;
    }

    // Check if the book is overdue
    public function isOverdue()
    {
        return $this->isActive() && now()->gt($this->due_date);
    }
}