<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookBorrowing extends Model
{
    use HasFactory;

    protected $fillable = [
        'library_item_id',
        'student_id',
        'status',
        'request_date',
        'return_date'
    ];

    protected $casts = [
        'request_date' => 'datetime',
        'return_date' => 'datetime',
    ];

    public function libraryItem()
    {
        return $this->belongsTo(LibraryItem::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}