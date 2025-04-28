<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttemptAnswer extends Model
{
    protected $fillable = ['quiz_attempt_id', 'question_id', 'selected_option_id', 'is_correct'];
    
    public function attempt()
    {
        return $this->belongsTo(QuizAttempt::class, 'quiz_attempt_id');
    }
    
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
    
    public function selectedOption()
    {
        return $this->belongsTo(Option::class, 'selected_option_id');
    }
}
