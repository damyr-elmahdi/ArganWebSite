<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'student_name',
        'academic_level',
        'parent_name',
        'parent_profession',
        'father_phone',
        'mother_phone',
        'student_phone',
        'address',
        'civil_status',
        'death_date',
        'signature_path',
        'processed',
        'submission_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'death_date' => 'date',
        'submission_date' => 'datetime',
        'processed' => 'boolean',
    ];
}