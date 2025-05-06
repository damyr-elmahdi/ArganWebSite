<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'exam_date',
        'start_time',
        'end_time',
        'teacher_id',
        'subject_id',
        'class_name',
        'room',
        'status'
    ];

    protected $casts = [
        'exam_date' => 'date',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}