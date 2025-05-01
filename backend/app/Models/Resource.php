<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'subject',
        'year_level',
        'specialization',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'uploaded_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who uploaded this resource.
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}