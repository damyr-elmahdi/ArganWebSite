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
        // Validate the basic requirements
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option_id' => 'nullable|exists:options,id',  // Make it nullable
            'time_expired' => 'boolean', // New field to check if time expired
        ]);
        
        $question = Question::findOrFail($validated['question_id']);
        
        // Handle time expired case - always mark as incorrect
        if ($request->has('time_expired') && $request->time_expired === true) {
            // Get the correct option for reference in the response
            $correctOption = $question->correctOption();
            
            // Create an answer record with is_correct = false
            $answer = AttemptAnswer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'selected_option_id' => null,  // No option was selected
                'is_correct' => false,  // Always false for time expired
            ]);
            
            return response()->json([
                'is_correct' => false,
                'correct_option_id' => $correctOption->id,
                'time_expired' => true
            ]);
        }
        
        // Normal case - user selected an option
        if (!isset($validated['selected_option_id'])) {
            return response()->json([
                'message' => 'selected_option_id is required when not time expired'
            ], 422);
        }
        
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
        // Load all necessary relationships for the quiz results view
        $attempt->load([
            'quiz', 
            'answers.question.options', 
            'answers.selectedOption'
        ]);
        
        return response()->json($attempt);
    }

    public function userAttempts()
    {
        $attempts = QuizAttempt::with(['quiz.questions'])
            ->where('user_id', auth()->id())
            ->whereNotNull('completed_at')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($attempts);
    }
}