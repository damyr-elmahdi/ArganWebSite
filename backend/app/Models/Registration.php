<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'date_of_birth',
        'address',
        'previous_school',
        'parent_name',
        'parent_occupation',
        'father_phone',
        'mother_phone',
        'student_phone',
        'family_status',
        'orphan_date',

    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'orphan_date' => 'date',
        'processed' => 'boolean',
    ];
}