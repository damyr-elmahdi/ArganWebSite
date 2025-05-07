<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    /**
     * Display a listing of the exams.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role === 'administrator') {
            // Administrators can see all exams
            $exams = Exam::latest()->get();
        } elseif ($user->role === 'student') {
            // Students can only see exams for their class and grade
            $student = Student::where('user_id', $user->id)->first();
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }
            
            $exams = Exam::where('grade', $student->grade)
                ->where('class_name', $student->class_code) // Changed from class_name to class_code to match the students table
                ->latest()
                ->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($exams);
    }

    /**
     * Store a newly created exam in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf|max:10240', // max 10MB
            'grade' => 'required|string|max:10',
            'class_name' => 'required|string|max:10',
            'exam_date' => 'required|date',
            'subject' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Store the file
        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('exams', $fileName, 'public');
        
        // Create the exam
        $exam = Exam::create([
            'title' => $request->title,
            'file_path' => $filePath,
            'grade' => $request->grade,
            'class_name' => $request->class_name,
            'exam_date' => $request->exam_date,
            'subject' => $request->subject,
            'description' => $request->description,
        ]);
        
        return response()->json($exam, 201);
    }

    /**
     * Display the specified exam.
     */
    public function show($id)
    {
        $exam = Exam::findOrFail($id);
        
        $user = Auth::user();
        
        // Check if user is authorized to view this exam
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if (!$student || $student->grade !== $exam->grade || $student->class_code !== $exam->class_name) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        
        return response()->json($exam);
    }

    /**
     * Update the specified exam in storage.
     */
    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);
        
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf|max:10240', // max 10MB
            'grade' => 'required|string|max:10',
            'class_name' => 'required|string|max:10',
            'exam_date' => 'required|date',
            'subject' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Update file if a new one is provided
        if ($request->hasFile('file')) {
            // Delete the old file
            Storage::disk('public')->delete($exam->file_path);
            
            // Store the new file
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('exams', $fileName, 'public');
            
            $exam->file_path = $filePath;
        }
        
        // Update exam details
        $exam->title = $request->title;
        $exam->grade = $request->grade;
        $exam->class_name = $request->class_name;
        $exam->exam_date = $request->exam_date;
        $exam->subject = $request->subject;
        $exam->description = $request->description;
        $exam->save();
        
        return response()->json($exam);
    }

    /**
     * Remove the specified exam from storage.
     */
    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        
        // Delete the file
        Storage::disk('public')->delete($exam->file_path);
        
        // Delete the exam record
        $exam->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Download the exam file.
     */
    public function download($id)
    {
        $exam = Exam::findOrFail($id);
        $user = Auth::user();
        
        // Check if user is authorized to download this exam
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if (!$student || $student->grade !== $exam->grade || $student->class_code !== $exam->class_name) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        
        if (!Storage::disk('public')->exists($exam->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        return response()->download(storage_path('app/public/' . $exam->file_path), $exam->title . '.pdf');
    }

    /**
     * View the exam file.
     */
    public function view($id)
    {
        $exam = Exam::findOrFail($id);
        $user = Auth::user();
        
        // Check if user is authorized to view this exam
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if (!$student || $student->grade !== $exam->grade || $student->class_code !== $exam->class_name) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        
        if (!Storage::disk('public')->exists($exam->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        // Return the file with content-type appropriate for viewing in browser
        return response()->file(storage_path('app/public/' . $exam->file_path));
    }
}