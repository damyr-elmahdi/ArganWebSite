<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\CompletedQuiz;
use Illuminate\Http\Request;
use App\Services\QuizService;

class QuizController extends Controller
{
    protected $quizService;
    
    public function __construct(QuizService $quizService)
    {
        $this->middleware('auth:sanctum');
        $this->quizService = $quizService;
    }
    
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Quiz::query();
        
        // Filter by subject if provided
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        // For students, only show active quizzes
        if ($user->isStudent()) {
            $query->where('is_active', true);
        }
        // For teachers, show quizzes they created
        elseif ($user->isTeacher()) {
            $query->where('creator_id', $user->id);
        }
        
        $quizzes = $query->with('subject:id,name')->paginate(10);
        
        return response()->json($quizzes);
    }
    
    public function show(Quiz $quiz)
    {
        $this->authorize('view', $quiz);
        
        $quiz->load(['subject:id,name', 'questions']);
        
        return response()->json($quiz);
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', Quiz::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'is_active' => 'boolean',
            'questions' => 'array',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correct_option' => 'required|integer|min:0',
            'questions.*.points' => 'integer|min:1',
        ]);
        
        $quiz = new Quiz([
            'title' => $validated['title'],
            'subject_id' => $validated['subject_id'],
            'is_active' => $validated['is_active'] ?? false,
        ]);
        
        $quiz->creator_id = $request->user()->id;
        $quiz->save();
        
        // Add questions if provided
        if (isset($validated['questions'])) {
            foreach ($validated['questions'] as $questionData) {
                $question = new Question([
                    'question_text' => $questionData['question_text'],
                    'options' => $questionData['options'],
                    'correct_option' => $questionData['correct_option'],
                    'points' => $questionData['points'] ?? 1,
                ]);
                
                $quiz->questions()->save($question);
            }
        }
        
        $quiz->load('questions');
        
        return response()->json($quiz, 201);
    }
    
    public function update(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'subject_id' => 'exists:subjects,id',
            'is_active' => 'boolean',
        ]);
        
        $quiz->update($validated);
        
        return response()->json($quiz);
    }
    
    public function destroy(Quiz $quiz)
    {
        $this->authorize('delete', $quiz);
        
        $quiz->delete();
        
        return response()->json(null, 204);
    }
    
    public function addQuestion(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        
        $validated = $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_option' => 'required|integer|min:0',
            'points' => 'integer|min:1',
        ]);
        
        $question = new Question([
            'question_text' => $validated['question_text'],
            'options' => $validated['options'],
            'correct_option' => $validated['correct_option'],
            'points' => $validated['points'] ?? 1,
        ]);
        
        $quiz->questions()->save($question);
        
        return response()->json($question, 201);
    }
    
    public function takeQuiz(Request $request, Quiz $quiz)
    {
        $this->authorize('take', $quiz);
        
        $user = $request->user();
        
        // Check if the quiz is active
        if (!$quiz->is_active) {
            return response()->json(['message' => 'This quiz is not currently active.'], 403);
        }
        
        // Check if student has already taken this quiz
        $alreadyTaken = CompletedQuiz::where('quiz_id', $quiz->id)
            ->where('student_id', $user->id)
            ->exists();
            
        if ($alreadyTaken) {
            return response()->json(['message' => 'You have already taken this quiz.'], 403);
        }
        
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);
        
        $completedQuiz = new CompletedQuiz([
            'quiz_id' => $quiz->id,
            'student_id' => $user->id,
            'answers' => $validated['answers'],
            'score' => 0,
        ]);
        
        $completedQuiz->save();
        $score = $this->quizService->gradeQuiz($completedQuiz);
        
        return response()->json([
            'completed_quiz' => $completedQuiz,
            'score' => $score,
            'total_possible' => $this->quizService->getTotalPossibleScore($quiz),
        ]);
    }
    
    public function getResults(Quiz $quiz)
    {
        $this->authorize('viewResults', $quiz);
        
        $results = CompletedQuiz::where('quiz_id', $quiz->id)
            ->with('student:id,name')
            ->get();
            
        return response()->json($results);
    }
    
    public function activate(Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        
        $quiz->activate();
        
        return response()->json($quiz);
    }
    
    public function deactivate(Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        
        $quiz->deactivate();
        
        return response()->json($quiz);
    }
}
