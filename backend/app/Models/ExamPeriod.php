<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'number_of_exams',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created this exam period.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all exam schedules for this exam period.
     */
    public function examSchedules()
    {
        return $this->hasMany(ExamSchedule::class);
    }

    /**
     * Get exam schedules grouped by class code
     */
    public function getSchedulesByClass()
    {
        return $this->examSchedules()
            ->with('teacher.user')
            ->get()
            ->groupBy('class_code');
    }
}