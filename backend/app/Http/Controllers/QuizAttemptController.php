<?php

namespace App\Http\Controllers;

use App\Models\AttemptAnswer;
use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class QuizAttemptController extends Controller
{
    // Start a quiz attempt
    public function start(Quiz $quiz)
    {
        $attempt = QuizAttempt::create([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'score' => 0,
        ]);
        
        return response()->json(['attempt_id' => $attempt->id]);
    }
    
    // Submit an answer during a quiz
    public function submitAnswer(Request $request, QuizAttempt $attempt)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option_id' => 'required|exists:options,id',
        ]);
        
        $question = Question::findOrFail($validated['question_id']);
        $selectedOption = Option::findOrFail($validated['selected_option_id']);
        $isCorrect = $selectedOption->is_correct;
        
        $answer = AttemptAnswer::create([
            'quiz_attempt_id' => $attempt->id,
            'question_id' => $question->id,
            'selected_option_id' => $selectedOption->id,
            'is_correct' => $isCorrect,
        ]);
        
        if ($isCorrect) {
            $attempt->increment('score');
        }
        
        return response()->json([
            'is_correct' => $isCorrect,
            'correct_option_id' => $question->correctOption()->id,
        ]);
    }
    
    // Complete a quiz attempt
    public function complete(QuizAttempt $attempt)
    {
        $attempt->update(['completed_at' => now()]);
        
        return response()->json([
            'score' => $attempt->score,
            'total_questions' => $attempt->quiz->questions->count(),
        ]);
    }
    
    // Get results for a completed quiz attempt
    public function results(QuizAttempt $attempt)
    {
        $attempt->load(['answers.question.options', 'answers.selectedOption']);
        
        return response()->json($attempt);
    }
}