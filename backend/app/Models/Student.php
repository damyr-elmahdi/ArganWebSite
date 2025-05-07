<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class_code',
        'student_id',
        'grade',
        'recovery_email',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function completedQuizzes()
    {
        return $this->user->completedQuizzes();
    }

    /**
     * Get the class label for this student
     */
    public function getClassLabel()
    {
        $classCodes = [
            'TC-S' => 'TC - Sciences',
            'TC-LSH' => 'TC - Lettres et Sciences Humaines',
            '1BAC-SE' => '1BAC - Sciences Expérimentales',
            '1BAC-LSH' => '1BAC - Lettres et Sciences Humaines',
            '2BAC-PC' => '2BAC - PC (Physique-Chimie)',
            '2BAC-SVT' => '2BAC - SVT (Sciences de la Vie et de la Terre)',
            '2BAC-SH' => '2BAC - Sciences Humaines',
            '2BAC-L' => '2BAC - Lettres',
        ];
        
        return $classCodes[$this->class_code] ?? $this->class_code;
    }

    /**
     * Get exam schedules for this student's class
     */
    public function examSchedules()
    {
        if (!$this->class_code) {
            return collect([]);
        }
        
        // Find active exam periods
        $activePeriods = ExamPeriod::where('is_active', true)->pluck('id');
        
        // Return schedules for student's class in active exam periods
        return ExamSchedule::whereIn('exam_period_id', $activePeriods)
            ->where('class_code', $this->class_code)
            ->with('teacher.user', 'examPeriod')
            ->orderBy('exam_order')
            ->orderBy('exam_date')
            ->get();
    }
}