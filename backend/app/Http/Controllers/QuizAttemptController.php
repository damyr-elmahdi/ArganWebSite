<?php

namespace App\Http\Controllers;

use App\Models\AttemptAnswer;
use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuizAttemptController extends Controller
{
    // Start a quiz attempt
    public function start(Request $request, Quiz $quiz)
    {
        // Check if there's an existing attempt that isn't completed
        $existingAttempt = QuizAttempt::where('user_id', auth()->id())
            ->where('quiz_id', $quiz->id)
            ->whereNull('completed_at')
            ->first();
        
        if ($existingAttempt) {
            // Return the existing attempt instead of creating a new one
            return response()->json([
                'attempt_id' => $existingAttempt->id,
                'resumed' => true,
                'current_question_index' => $existingAttempt->answers->count()
            ]);
        }
        
        // Check if user has already completed this quiz
        $completedAttempt = QuizAttempt::where('user_id', auth()->id())
            ->where('quiz_id', $quiz->id)
            ->whereNotNull('completed_at')
            ->exists();
        
        if ($completedAttempt && !$quiz->allows_multiple_attempts) {
            return response()->json([
                'error' => 'You have already completed this quiz.',
                'status' => 'denied'
            ], 403);
        }
        
        // Create a new attempt if eligible
        $attempt = QuizAttempt::create([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'score' => 0,
            'started_at' => now(),
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
    
    // Complete a quiz attempt - updated to handle anti-cheat detections
    public function complete(Request $request, QuizAttempt $attempt)
    {
        // Add a flag to record if the quiz was forcibly completed due to anti-cheat detection
        $forcedCompletion = $request->has('forced_completion') && $request->forced_completion === true;
        
        // Check if this is a forced completion (anti-cheat)
        if ($forcedCompletion) {
            // You could log this information for monitoring
            \Log::warning("Quiz attempt #{$attempt->id} was forcibly completed - potential cheating detected");
            
            // You might want to add a flag to the database to mark this attempt
            // This would require adding a 'forced_completion' column to the quiz_attempts table
            $attempt->update([
                'completed_at' => now(),
                // Uncomment if you add this column to the database
                // 'forced_completion' => true,
            ]);
        } else {
            // Normal completion
            $attempt->update(['completed_at' => now()]);
        }
        
        return response()->json([
            'score' => $attempt->score,
            'total_questions' => $attempt->quiz->questions->count(),
            'forced_completion' => $forcedCompletion,
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

    public function checkAttemptEligibility(Quiz $quiz)
{
    // Check if user has a completed attempt for this quiz
    $existingAttempt = QuizAttempt::where('user_id', auth()->id())
        ->where('quiz_id', $quiz->id)
        ->whereNotNull('completed_at')
        ->exists();
    
    // Check if user has an in-progress attempt
    $inProgressAttempt = QuizAttempt::where('user_id', auth()->id())
        ->where('quiz_id', $quiz->id)
        ->whereNull('completed_at')
        ->first();
    
    return response()->json([
        'can_attempt' => !$existingAttempt,
        'in_progress_attempt' => $inProgressAttempt ? $inProgressAttempt->id : null
    ]);
}

public function validateQuestionSequence(Request $request, QuizAttempt $attempt)
{
    $validated = $request->validate([
        'question_id' => 'required|exists:questions,id',
        'expected_index' => 'required|integer|min:0',
    ]);
    
    $question = Question::findOrFail($validated['question_id']);
    
    // Count how many questions have been answered
    $answeredCount = $attempt->answers()->count();
    
    // This ensures the questions are answered in sequence
    if ($validated['expected_index'] != $answeredCount) {
        return response()->json([
            'valid' => false,
            'expected_index' => $answeredCount,
            'message' => 'Questions must be answered in sequence'
        ], 400);
    }
    
    return response()->json(['valid' => true]);
}
}