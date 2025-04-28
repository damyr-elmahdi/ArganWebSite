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
    // In QuizController.php, modify the index method
    public function index()
    {
        // For teachers - get all quizzes with question count and attempt count
        if (auth()->user()->isTeacher()) {
            $quizzes = Quiz::with('subject', 'questions')
                ->withCount('questions')
                ->withCount('attempts')
                ->where('created_by', auth()->id())
                ->get();
        } else {
            // For students - get available quizzes
            $quizzes = Quiz::with('questions')->get();
        }

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
    // For teachers - update a quiz
    public function update(Request $request, Quiz $quiz)
    {
        // Check if the authenticated user is the creator of this quiz
        if ($quiz->created_by !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array|min:3|max:4',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        // Update quiz details
        $quiz->update([
            'title' => $validated['title'],
            'subject_id' => $validated['subject_id'],
        ]);

        // Delete existing questions and options
        foreach ($quiz->questions as $question) {
            $question->options()->delete();
        }
        $quiz->questions()->delete();

        // Create new questions and options
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

        return response()->json($quiz->load('questions.options'));
    }

    public function teacherQuizzes()
    {
        $quizzes = Quiz::with('subject', 'questions')
            ->withCount('questions')
            ->withCount('attempts')
            ->where('created_by', auth()->id())
            ->get();

        return response()->json($quizzes);
    }
}
