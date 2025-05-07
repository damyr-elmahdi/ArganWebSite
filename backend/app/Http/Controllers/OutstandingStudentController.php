<?php

namespace App\Http\Controllers;

use App\Models\OutstandingStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OutstandingStudentController extends Controller
{
    /**
     * Display a listing of outstanding students.
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
            'student_id' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'grade' => 'required|string|max:50',
            'mark' => 'required|numeric|min:0|max:20',
            'achievement' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['student_id', 'name', 'grade', 'mark', 'achievement']);
        
        // Convert mark to float explicitly
        $data['mark'] = (float) $data['mark'];
        
        // Handle photo upload
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $photo = $request->file('photo');
            $fileName = time() . '_' . $photo->getClientOriginalName();
            
            // Store in public disk directly
            $path = $photo->storeAs('student_photos', $fileName, 'public');
            // Make sure we're using the URL not just the path
            $data['photo_path'] = '/storage/' . $path;
        }

        $student = OutstandingStudent::create($data);
        
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
        $student = OutstandingStudent::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'student_id' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'grade' => 'required|string|max:50',
            'mark' => 'required|numeric|min:0|max:20',
            'achievement' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['student_id', 'name', 'grade', 'mark', 'achievement']);
        
        // Convert mark to float explicitly
        $data['mark'] = (float) $data['mark'];
        
        // Handle photo upload
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Delete old photo if it exists
            if ($student->photo_path) {
                // Strip '/storage/' prefix if present to get the actual path
                $oldPath = str_replace('/storage/', '', $student->photo_path);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            $photo = $request->file('photo');
            $fileName = time() . '_' . $photo->getClientOriginalName();
            
            // Store in public disk directly
            $path = $photo->storeAs('student_photos', $fileName, 'public');
            // Use a consistent format with leading slash
            $data['photo_path'] = '/storage/' . $path;
        }

        $student->update($data);
        
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
        
        // Delete the photo if it exists
        if ($student->photo_path) {
            // Strip '/storage/' prefix if present to get the actual path
            $oldPath = str_replace('/storage/', '', $student->photo_path);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
        
        $student->delete();
        
        return response()->json(['message' => 'Student deleted successfully']);
    }
}