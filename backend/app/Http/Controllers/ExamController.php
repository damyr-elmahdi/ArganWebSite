<?php

namespace App\Http\Controllers;

use App\Models\ExamPeriod;
use App\Models\ExamSchedule;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    /**
     * Get all active exam periods
     */
    public function getExamPeriods()
    {
        $user = Auth::user();
        
        // Students only see active exam periods
        if ($user->isStudent()) {
            $examPeriods = ExamPeriod::where('is_active', true)->get();
        } else {
            // Admins, teachers see all exam periods
            $examPeriods = ExamPeriod::orderBy('created_at', 'desc')->get();
        }
        
        return response()->json($examPeriods);
    }
    
    /**
     * Create a new exam period
     */
    public function createExamPeriod(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'required|date',
            'number_of_exams' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $examPeriod = ExamPeriod::create([
            'name' => $request->name,
            'description' => $request->description,
            'exam_date' => $request->exam_date,
            'number_of_exams' => $request->number_of_exams,
            'is_active' => $request->is_active ?? true,
            'created_by' => Auth::id(),
        ]);

        return response()->json($examPeriod, 201);
    }
    
    /**
     * Get exam period details with schedules
     */
    public function getExamPeriodDetails($id)
    {
        $examPeriod = ExamPeriod::with('examSchedules.teacher.user')->findOrFail($id);
        
        $user = Auth::user();
        
        // If user is a student, filter to show only their class
        if ($user->isStudent() && $user->student) {
            $classCode = $user->student->class_code;
            $schedules = $examPeriod->examSchedules()
                ->where('class_code', $classCode)
                ->with('teacher.user')
                ->orderBy('exam_order')
                ->get();
                
            return response()->json([
                'exam_period' => $examPeriod,
                'schedules' => $schedules
            ]);
        }
        
        // For admins, return all schedules grouped by class
        $schedulesByClass = $examPeriod->examSchedules()
            ->with('teacher.user')
            ->orderBy('class_code')
            ->orderBy('exam_order')
            ->get()
            ->groupBy('class_code');
            
        return response()->json([
            'exam_period' => $examPeriod,
            'schedules_by_class' => $schedulesByClass
        ]);
    }
    
    /**
     * Update an exam period
     */
    public function updateExamPeriod(Request $request, $id)
    {
        $examPeriod = ExamPeriod::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_date' => 'required|date',
            'number_of_exams' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $examPeriod->update($request->all());
        
        return response()->json($examPeriod);
    }
    
    /**
     * Delete an exam period
     */
    public function deleteExamPeriod($id)
    {
        $examPeriod = ExamPeriod::findOrFail($id);
        $examPeriod->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Create or update exam schedules (bulk)
     */
    public function updateExamSchedules(Request $request, $examPeriodId)
    {
        $examPeriod = ExamPeriod::findOrFail($examPeriodId);
        
        $validator = Validator::make($request->all(), [
            'schedules' => 'required|array',
            'schedules.*.class_code' => 'required|string|max:10',
            'schedules.*.subject' => 'required|string|max:255',
            'schedules.*.teacher_id' => 'nullable|exists:teachers,id',
            'schedules.*.exam_order' => 'required|integer|min:1|max:' . $examPeriod->number_of_exams,
            'schedules.*.notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        
        try {
            foreach ($request->schedules as $scheduleData) {
                ExamSchedule::updateOrCreate(
                    [
                        'exam_period_id' => $examPeriodId,
                        'class_code' => $scheduleData['class_code'],
                        'subject' => $scheduleData['subject'],
                        'exam_order' => $scheduleData['exam_order'],
                    ],
                    [
                        'teacher_id' => $scheduleData['teacher_id'],
                        'exam_date' => $examPeriod->exam_date, // Use the exam period's date
                        'notes' => $scheduleData['notes'] ?? null,
                    ]
                );
            }
            
            DB::commit();
            
            $updatedExamPeriod = ExamPeriod::with('examSchedules.teacher.user')->findOrFail($examPeriodId);
            return response()->json($updatedExamPeriod);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update exam schedules: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Delete an exam schedule
     */
    public function deleteExamSchedule($id)
    {
        $schedule = ExamSchedule::findOrFail($id);
        $schedule->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Get list of teachers for dropdown
     */
    public function getTeachersList()
    {
        $teachers = Teacher::with('user')
            ->where('is_active', true)
            ->get()
            ->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->user->name,
                    'department' => $teacher->department,
                    'specialization' => $teacher->specialization
                ];
            });
            
        return response()->json($teachers);
    }
    
    /**
     * Get class codes for dropdown
     */
    public function getClassCodes()
    {
        $classCodes = [
            ['value' => 'TC-S', 'label' => 'TC - Sciences'],
            ['value' => 'TC-LSH', 'label' => 'TC - Lettres et Sciences Humaines'],
            ['value' => 'TC-A', 'label' => 'TC - A'],
            ['value' => 'TC-B', 'label' => 'TC - B'],
            ['value' => 'TC-C', 'label' => 'TC - C'],
            ['value' => '1BAC-SE', 'label' => '1BAC - Sciences Expérimentales'],
            ['value' => '1BAC-LSH', 'label' => '1BAC - Lettres et Sciences Humaines'],
            ['value' => '1BAC-A', 'label' => '1BAC - A'],
            ['value' => '1BAC-B', 'label' => '1BAC - B'],
            ['value' => '1BAC-C', 'label' => '1BAC - C'],
            ['value' => '2BAC-PC', 'label' => '2BAC - PC (Physique-Chimie)'],
            ['value' => '2BAC-SVT', 'label' => '2BAC - SVT (Sciences de la Vie et de la Terre)'],
            ['value' => '2BAC-SH', 'label' => '2BAC - Sciences Humaines'],
            ['value' => '2BAC-L', 'label' => '2BAC - Lettres'],
            ['value' => '2BAC-A', 'label' => '2BAC - A'],
            ['value' => '2BAC-B', 'label' => '2BAC - B'],
            ['value' => '2BAC-C', 'label' => '2BAC - C'],
        ];
        
        return response()->json($classCodes);
    }
    
    /**
     * Get subject list for dropdown
     */
    public function getSubjects()
    {
        $subjects = [
            'Arabic',
            'French',
            'English Language',
            'Social Studies',
            'Islamic Education',
            'Philosophy',
            'Physical Education',
            'Physical Sciences',
            'Mathematics',
            'Informatics',
            'History and Geography',
            'Life and Earth Sciences'
        ];
        
        return response()->json($subjects);
    }
}