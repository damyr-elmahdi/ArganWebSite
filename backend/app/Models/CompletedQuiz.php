<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompletedQuiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'answers',
        'score',
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
    
    public function calculateScore()
    {
        $score = 0;
        $questions = $this->quiz->questions;
        $answers = $this->answers;
        
        foreach ($questions as $index => $question) {
            if (isset($answers[$index]) && $question->checkAnswer($answers[$index])) {
                $score += $question->points;
            }
        }
        
        $this->score = $score;
        $this->save();
        
        return $score;
    }
}