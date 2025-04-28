<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class ResultsController extends Controller
{
    public function index(Request $request)
    {
        // Optional filter by quiz
        $quizId = $request->query('quiz_id');
        
        $query = QuizAttempt::with(['user', 'quiz'])
            ->whereNotNull('completed_at')
            ->orderBy('created_at', 'desc');
            
        if ($quizId) {
            $query->where('quiz_id', $quizId);
        }
        
        $attempts = $query->paginate(20);
        
        return response()->json($attempts);
    }
    
    public function show(QuizAttempt $attempt)
    {
        $attempt->load([
            'user', 
            'quiz', 
            'answers.question.options', 
            'answers.selectedOption'
        ]);
        
        return response()->json($attempt);
    }
}
