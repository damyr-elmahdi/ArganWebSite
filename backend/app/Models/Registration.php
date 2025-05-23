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
        'grade_applying_for',   
        'parent_name',         
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
        // Removed date_of_birth
        'orphan_date' => 'date',
        'processed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}