<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_period_id',
        'class_code',
        'subject',
        'teacher_id',
        'exam_date',
        'exam_order',
        'notes'
    ];

    protected $casts = [
        'exam_date' => 'date',
    ];

    /**
     * Get the exam period that owns this schedule.
     */
    public function examPeriod()
    {
        return $this->belongsTo(ExamPeriod::class);
    }

    /**
     * Get the teacher assigned to this exam.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    
    /**
     * Get formatted data for student view
     */
    public function getFormattedForStudent()
    {
        return [
            'subject' => $this->subject,
            'exam_date' => $this->exam_date->format('Y-m-d'),
            'teacher_name' => $this->teacher ? $this->teacher->user->name : 'Not Assigned',
            'exam_order' => $this->exam_order,
            'notes' => $this->notes
        ];
    }
}