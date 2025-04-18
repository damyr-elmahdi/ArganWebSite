<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'date_of_birth',
        'phone',
        'address',
        'previous_school',
        'grade_applying_for',
        'info_packet_path',
        'processed'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'processed' => 'boolean',
    ];
}