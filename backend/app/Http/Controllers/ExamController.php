<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::with(['teacher.user', 'subject']);
        
        // Filter by class name if provided
        if ($request->has('class')) {
            $query->where('class_name', $request->class);
        }
        
        // Filter by date range if provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('exam_date', [$request->start_date, $request->end_date]);
        }
        
        // Filter by subject if provided
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        $exams = $query->orderBy('exam_date', 'asc')
                       ->orderBy('start_time', 'asc')
                       ->get();

        return response()->json([
            'data' => $exams
        ]);
    }

    public function show(Exam $exam)
    {
        $exam->load(['teacher.user', 'subject']);
        
        return response()->json([
            'data' => $exam
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'class_name' => 'required|string|max:20',
            'room' => 'nullable|string|max:50',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exam = Exam::create($request->all());
        $exam->load(['teacher.user', 'subject']);

        return response()->json([
            'message' => 'Exam created successfully',
            'data' => $exam
        ], 201);
    }

    public function update(Request $request, Exam $exam)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'sometimes|date',
            'start_time' => 'sometimes',
            'end_time' => 'sometimes|after:start_time',
            'teacher_id' => 'sometimes|exists:teachers,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'class_name' => 'sometimes|string|max:20',
            'room' => 'nullable|string|max:50',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exam->update($request->all());
        $exam->load(['teacher.user', 'subject']);

        return response()->json([
            'message' => 'Exam updated successfully',
            'data' => $exam
        ]);
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return response()->json([
            'message' => 'Exam deleted successfully'
        ]);
    }

    public function getClasses()
    {
        $classes = Exam::select('class_name')->distinct()->orderBy('class_name')->get();
        return response()->json(['data' => $classes]);
    }

    // Method to get exams by class
    public function getExamsByClass($class)
    {
        $exams = Exam::with(['teacher.user', 'subject'])
                    ->where('class_name', $class)
                    ->orderBy('exam_date', 'asc')
                    ->orderBy('start_time', 'asc')
                    ->get();

        return response()->json([
            'data' => $exams
        ]);
    }
}