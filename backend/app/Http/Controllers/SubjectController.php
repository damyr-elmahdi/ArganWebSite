<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    /**
     * Display a listing of all subjects.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $subjects = Subject::orderBy('name')->get();
        
        return response()->json($subjects);
    }

    /**
     * Display the specified subject.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Subject $subject)
    {
        return response()->json($subject);
    }

    /**
     * Store a newly created subject in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:subjects',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subject = new Subject();
        $subject->name = $request->name;
        $subject->description = $request->description;
        $subject->created_by = auth()->id();
        $subject->save();

        return response()->json([
            'message' => 'Subject created successfully',
            'data' => $subject
        ], 201);
    }

    /**
     * Update the specified subject in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Subject $subject)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:subjects,name,' . $subject->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('name')) {
            $subject->name = $request->name;
        }
        
        if ($request->has('description')) {
            $subject->description = $request->description;
        }
        
        $subject->save();

        return response()->json([
            'message' => 'Subject updated successfully',
            'data' => $subject
        ]);
    }

    /**
     * Remove the specified subject from storage.
     *
     * @param  \App\Models\Subject  $subject
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Subject $subject)
    {
        // Check if subject is being used by exams or quizzes
        if ($subject->quizzes()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete subject that is associated with quizzes'
            ], 422);
        }
        
        $subject->delete();

        return response()->json([
            'message' => 'Subject deleted successfully'
        ]);
    }
}