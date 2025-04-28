<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    protected $fillable = ['user_id', 'quiz_id', 'score', 'completed_at'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
    
    public function answers()
    {
        return $this->hasMany(AttemptAnswer::class);
    }
}