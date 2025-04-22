<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherAbsence extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'announced_by',
        'start_date',
        'end_date',
        'reason',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function announcer()
    {
        return $this->belongsTo(User::class, 'announced_by');
    }
    
    public function notifications()
    {
        return $this->hasMany(AbsenceNotification::class, 'absence_id');
    }
}