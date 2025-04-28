<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\CompletedQuiz;
use Illuminate\Http\Request;
use App\Services\QuizService;

class QuizController extends Controller
{
    // For students - get available quizzes
    public function index()
    {
        $quizzes = Quiz::with('questions')->get();
        return response()->json($quizzes);
    }
    
    // For students - get specific quiz
    public function show(Quiz $quiz)
    {
        $quiz->load('questions.options');
        return response()->json($quiz);
    }
    
    // For teachers - create quiz
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array|min:3|max:4',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);
        
        $quiz = Quiz::create([
            'title' => $validated['title'],
            'subject_id' => $validated['subject_id'],
            'created_by' => auth()->id(),
        ]);
        
        foreach ($validated['questions'] as $questionData) {
            $question = $quiz->questions()->create([
                'question_text' => $questionData['question_text'],
            ]);
            
            foreach ($questionData['options'] as $optionData) {
                $question->options()->create([
                    'option_text' => $optionData['option_text'],
                    'is_correct' => $optionData['is_correct'],
                ]);
            }
        }
        
        return response()->json($quiz->load('questions.options'), 201);
    }
}
