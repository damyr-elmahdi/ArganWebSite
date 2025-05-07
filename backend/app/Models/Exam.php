<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'file_path',
        'grade',
        'class_name',
        'exam_date',
        'subject',
        'description',
    ];
    
    protected $casts = [
        'exam_date' => 'date',
    ];
}