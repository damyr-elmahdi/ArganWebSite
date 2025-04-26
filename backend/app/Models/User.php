<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function librarian()
    {
        return $this->hasOne(Librarian::class);
    }

    public function administrator()
    {
        return $this->hasOne(Administrator::class);
    }

    /**
     * Check if the user is a student.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Check if the user is a librarian.
     */
    public function isLibrarian(): bool
    {
        return $this->role === 'librarian';
    }

    /**
     * Check if the user is an administrator.
     */
    public function isAdministrator(): bool
    {
        return $this->role === 'administrator';
    }

    /**
     * Get user's borrowing requests.
     */
    public function borrowingRequests()
    {
        return $this->hasMany(BookBorrowingRequest::class);
    }

    // Existing methods...
    public function sendPasswordResetNotification($token)
    {
        $url = config('app.frontend_url', 'http://localhost:5173') . '/reset-password/' . $token . '?email=' . urlencode($this->email);
        $this->notify(new \App\Notifications\ResetPassword($token, $url));
    }

    public function createdQuizzes()
    {
        return $this->hasMany(Quiz::class, 'creator_id');
    }

    public function completedQuizzes()
    {
        return $this->hasMany(CompletedQuiz::class, 'student_id');
    }

    public function uploadedResources()
    {
        return $this->hasMany(Resource::class, 'uploaded_by');
    }

    public function news()
    {
        return $this->hasMany(News::class, 'author_id');
    }

    public function announcedAbsences()
    {
        return $this->hasMany(TeacherAbsence::class, 'announced_by');
    }
    
    public function absenceNotifications()
    {
        return $this->hasMany(AbsenceNotification::class, 'student_id');
    }
}