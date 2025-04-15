<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }
    
    public function index()
    {
        $subjects = Subject::all();
        return response()->json($subjects);
    }
    
    public function show(Subject $subject)
    {
        return response()->json($subject);
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', Subject::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name',
            'description' => 'nullable|string',
        ]);
        
        $subject = Subject::create($validated);
        
        return response()->json($subject, 201);
    }
    
    public function update(Request $request, Subject $subject)
    {
        $this->authorize('update', $subject);
        
        $validated = $request->validate([
            'name' => 'string|max:255|unique:subjects,name,' . $subject->id,
            'description' => 'nullable|string',
        ]);
        
        $subject->update($validated);
        
        return response()->json($subject);
    }
    
    public function destroy(Subject $subject)
    {
        $this->authorize('delete', $subject);
        
        $subject->delete();
        
        return response()->json(null, 204);
    }
    
    public function resources(Subject $subject)
    {
        $resources = $subject->resources()->paginate(15);
        return response()->json($resources);
    }
    
    public function quizzes(Subject $subject)
    {
        $quizzes = $subject->quizzes()
            ->where('is_active', true)
            ->paginate(10);
            
        return response()->json($quizzes);
    }
}