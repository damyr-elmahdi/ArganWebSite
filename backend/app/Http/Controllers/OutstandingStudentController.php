<?php

namespace App\Http\Controllers;

use App\Models\OutstandingStudent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'mark' => 'required|numeric|min:0|max:20', // Changed to max:20
            'student_id' => 'nullable|string|max:255',
            'achievement' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = OutstandingStudent::create($request->all());
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
            'mark' => 'required|numeric|min:0|max:20', // Changed to max:20
            'student_id' => 'nullable|string|max:255',
            'achievement' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = OutstandingStudent::findOrFail($id);
        $student->update($request->all());
        
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
        $student->delete();
        
        return response()->json(null, 204);
    }
}