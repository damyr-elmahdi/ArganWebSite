<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'recovery_email',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the student record associated with the user.
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Get the teacher record associated with the user.
     */
    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    /**
     * Get the librarian record associated with the user.
     */
    public function librarian()
    {
        return $this->hasOne(Librarian::class);
    }

    /**
     * Get the administrator record associated with the user.
     */
    public function administrator()
    {
        return $this->hasOne(Administrator::class);
    }

    /**
     * Check if the user is a student.
     */
    public function isStudent()
    {
        return $this->role === 'student';
    }

    /**
     * Check if the user is a teacher.
     */
    public function isTeacher()
    {
        return $this->role === 'teacher';
    }
    
    /**
     * Check if the user is a librarian.
     */
    public function isLibrarian()
    {
        return $this->role === 'librarian';
    }
    
    /**
     * Check if the user is an administrator.
     */
    public function isAdministrator()
    {
        return $this->role === 'administrator';
    }

    /**
     * Check if the user has any of the given roles.
     *
     * @param array|string $roles
     * @return bool
     */
    public function hasRole($roles)
    {
        if (is_string($roles)) {
            return $this->role === $roles;
        }
        if (is_array($roles)) {
            return in_array($this->role, $roles);
        }
        return false;
    }



    /**
     * Get all quiz attempts by this user.
     */
    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
    
    /**
     * Get all quizzes created by this user.
     */
    public function createdQuizzes()
    {
        return $this->hasMany(Quiz::class, 'created_by');
    }

    /**
     * Get all resources uploaded by this user.
     */
    public function uploadedResources()
    {
        return $this->hasMany(Resource::class, 'uploaded_by');
    }

    /**
     * Alias for uploadedResources() for backward compatibility.
     */
    public function resources()
    {
        return $this->uploadedResources();
    }

    /**
     * Get all news articles created by this user.
     */
    public function news()
    {
        return $this->hasMany(News::class, 'author_id');
    }

    /**
     * Get all teacher absences announced by this user.
     */
    public function announcedAbsences()
    {
        return $this->hasMany(TeacherAbsence::class, 'announced_by');
    }
    
    /**
     * Get all absence notifications for this user.
     */
    public function absenceNotifications()
    {
        return $this->hasMany(AbsenceNotification::class, 'student_id');
    }
}