<?php
namespace App\Services;

use App\Models\Quiz;
use App\Models\CompletedQuiz;

class QuizService
{
    public function gradeQuiz(CompletedQuiz $completedQuiz)
    {
        $quiz = $completedQuiz->quiz;
        $questions = $quiz->questions;
        $answers = $completedQuiz->answers;
        
        $score = 0;
        
        foreach ($questions as $index => $question) {
            // Check if an answer was provided for this question
            if (isset($answers[$index]) && $question->checkAnswer($answers[$index])) {
                $score += $question->points;
            }
        }
        
        // Update and save the score
        $completedQuiz->score = $score;
        $completedQuiz->save();
        
        return $score;
    }
    
    public function getTotalPossibleScore(Quiz $quiz)
    {
        return $quiz->questions->sum('points');
    }
    
    public function getStudentResults($quizId, $studentId)
    {
        return CompletedQuiz::where('quiz_id', $quizId)
            ->where('student_id', $studentId)
            ->first();
    }
    
    public function getAllResults($quizId)
    {
        return CompletedQuiz::where('quiz_id', $quizId)
            ->with('student:id,name')
            ->get();
    }
}

