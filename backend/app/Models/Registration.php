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
        'full_name',            
        'date_of_birth',     
        'grade_applying_for',   
        'parent_occupation',   
        'father_phone',         
        'mother_phone',         
        'student_phone',        
        'address',              
        'family_status',        
        'orphan_date',          
        'previous_school',     
        'additional_notes',     
        'info_packet_path',     
        'processed',            
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'orphan_date' => 'date',
        'processed' => 'boolean',
    ];
}