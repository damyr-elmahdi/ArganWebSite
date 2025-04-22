<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbsenceNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'absence_id',
        'is_read',
        'read_at'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function absence()
    {
        return $this->belongsTo(TeacherAbsence::class, 'absence_id');
    }
}