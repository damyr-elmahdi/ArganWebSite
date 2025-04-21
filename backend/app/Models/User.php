<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable;

    // Your existing code...

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = config('app.frontend_url', 'http://localhost:3000') . '/reset-password/' . $token . '?email=' . urlencode($this->email);
        $this->notify(new \App\Notifications\ResetPassword($token, $url));
    }
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

    public function administrator()
    {
        return $this->hasOne(Administrator::class);
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isTeacher()
    {
        return $this->role === 'teacher';
    }

    public function isAdministrator()
    {
        return $this->role === 'administrator';
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
}
