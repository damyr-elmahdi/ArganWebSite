<?php

namespace App\Http\Controllers;

use App\Models\OutstandingStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class OutstandingStudentController extends Controller
{
    /**
     * Display a listing of the outstanding students.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $students = OutstandingStudent::orderBy('mark', 'desc')->get();
        return response()->json($students);
    }

    /**
     * Store a newly created outstanding student in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'mark' => 'required|numeric|min:0|max:20',
            'student_id' => 'nullable|string|max:255',
            'achievement' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Add this line for photo validation
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle photo upload if provided
        $photoPath = null;
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $photoName = time() . '_' . $request->file('photo')->getClientOriginalName();
            $photoPath = $request->file('photo')->storeAs('public/student_photos', $photoName);
            // Convert storage path to URL path
            $photoPath = str_replace('public/', 'storage/', $photoPath);
        }

        // Create student with photo path
        $studentData = $request->except('photo');
        $studentData['photo_path'] = $photoPath;
        
        $student = OutstandingStudent::create($studentData);
        return response()->json($student, 201);
    }

    /**
     * Display the specified outstanding student.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $student = OutstandingStudent::findOrFail($id);
        return response()->json($student);
    }

    /**
     * Update the specified outstanding student in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'mark' => 'required|numeric|min:0|max:20',
            'student_id' => 'nullable|string|max:255',
            'achievement' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = OutstandingStudent::findOrFail($id);
        
        // Handle photo upload if provided
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Delete old photo if exists
            if ($student->photo_path) {
                $oldPath = str_replace('storage/', 'public/', $student->photo_path);
                if (Storage::exists($oldPath)) {
                    Storage::delete($oldPath);
                }
            }
            
            // Upload new photo
            $photoName = time() . '_' . $request->file('photo')->getClientOriginalName();
            $photoPath = $request->file('photo')->storeAs('public/student_photos', $photoName);
            // Convert storage path to URL path
            $photoPath = str_replace('public/', 'storage/', $photoPath);
            $student->photo_path = $photoPath;
        }
        
        // Update other student data
        $student->name = $request->name;
        $student->grade = $request->grade;
        $student->mark = $request->mark;
        $student->student_id = $request->student_id;
        $student->achievement = $request->achievement;
        $student->save();
        
        return response()->json($student);
    }

    /**
     * Remove the specified outstanding student from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $student = OutstandingStudent::findOrFail($id);
        
        // Delete photo if exists
        if ($student->photo_path) {
            $path = str_replace('storage/', 'public/', $student->photo_path);
            if (Storage::exists($path)) {
                Storage::delete($path);
            }
        }
        
        $student->delete();
        
        return response()->json(null, 204);
    }
}