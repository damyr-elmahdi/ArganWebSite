<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\TeacherAbsence;
use App\Models\AbsenceNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherAbsenceController extends Controller
{
    /**
     * Get a list of all teachers for the absence form dropdown
     */
    public function getTeachers()
    {
        $teachers = Teacher::with('user')->get()->map(function ($teacher) {
            return [
                'id' => $teacher->id,
                'name' => $teacher->user->name,
                'employee_id' => $teacher->employee_id,
            ];
        });
        
        return response()->json($teachers);
    }
    
    /**
     * Get all absences (for admin view)
     */
    public function index()
    {
        $absences = TeacherAbsence::with(['teacher.user', 'announcer'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($absence) {
                return [
                    'id' => $absence->id,
                    'teacher_name' => $absence->teacher->user->name,
                    'teacher_id' => $absence->teacher->id,
                    'start_date' => $absence->start_date->format('Y-m-d'),
                    'end_date' => $absence->end_date->format('Y-m-d'),
                    'reason' => $absence->reason,
                    'announced_by' => $absence->announcer->name,
                    'is_active' => $absence->is_active,
                    'created_at' => $absence->created_at->format('Y-m-d H:i:s'),
                ];
            });
        
        return response()->json($absences);
    }
    
    /**
     * Create a new teacher absence announcement
     */
    public function store(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
        ]);
        
        DB::beginTransaction();
        try {
            // Create the absence record
            $absence = TeacherAbsence::create([
                'teacher_id' => $request->teacher_id,
                'announced_by' => $request->user()->id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'reason' => $request->reason,
                'is_active' => true,
            ]);
            
            // Create notifications for all students
            $students = User::where('role', 'student')->get();
            foreach ($students as $student) {
                AbsenceNotification::create([
                    'student_id' => $student->id,
                    'absence_id' => $absence->id,
                    'is_read' => false,
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Teacher absence announced successfully',
                'absence' => $absence->load('teacher.user'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to announce absence: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'message' => 'Failed to announce absence: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    /**
     * Update an existing absence
     */
    public function update(Request $request, TeacherAbsence $absence)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);
        
        $absence->update([
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'is_active' => $request->is_active,
        ]);
        
        return response()->json([
            'message' => 'Absence updated successfully',
            'absence' => $absence->load('teacher.user'),
        ]);
    }
    
    /**
     * Delete an absence
     */
    public function destroy(TeacherAbsence $absence)
    {
        // This will cascade delete the notifications as well
        $absence->delete();
        
        return response()->json([
            'message' => 'Absence announcement deleted successfully',
        ]);
    }
    
    /**
     * Get absence notifications for the current student
     */
    public function getStudentNotifications(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can view absence notifications'], 403);
        }
        
        $notifications = AbsenceNotification::where('student_id', $user->id)
            ->with(['absence.teacher.user'])
            ->whereHas('absence', function ($query) {
                // Only show active absences
                $query->where('is_active', true);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'teacher_name' => $notification->absence->teacher->user->name,
                    'start_date' => $notification->absence->start_date->format('Y-m-d'),
                    'end_date' => $notification->absence->end_date->format('Y-m-d'),
                    'reason' => $notification->absence->reason,
                    'is_read' => $notification->is_read,
                    'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                ];
            });
        
        return response()->json($notifications);
    }
    
    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, AbsenceNotification $notification)
    {
        if ($request->user()->id !== $notification->student_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }
}