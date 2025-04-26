<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookBorrowingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'library_item_id',
        'status',
        'due_date',
        'return_date',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'return_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function libraryItem()
    {
        return $this->belongsTo(LibraryItem::class);
    }

    // Scope for pending requests
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Scope for approved and active requests
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved')->whereNull('return_date');
    }

    // Scope for returned requests
    public function scopeReturned($query)
    {
        return $query->where('status', 'approved')->whereNotNull('return_date');
    }

    // Scope for rejected requests
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}