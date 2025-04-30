<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Administrator;
use App\Models\Librarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Optional filter by role
        $role = $request->query('role');
        
        $query = User::query();
        
        if ($role) {
            $query->where('role', $role);
        }
        
        $users = $query->latest()->paginate(15);
        
        return response()->json($users);
    }

    /**
     * Create a new user by administrator.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,teacher,administrator,librarian',
        ]);
        
        // Additional role-specific validations
        if ($request->role === 'student') {
            $request->validate([
                'grade' => 'nullable|string|max:20',
                'recovery_email' => 'nullable|email',
            ]);
        } elseif ($request->role === 'teacher') {
            $request->validate([
                'department' => 'nullable|string|max:100',
                'position' => 'nullable|string|max:100',
                'specialization' => 'nullable|string|max:100',
            ]);
        } elseif ($request->role === 'administrator') {
            $request->validate([
                'admin_level' => 'nullable|string|in:basic,intermediate,super',
                'department' => 'nullable|string|max:100',
            ]);
        }
    
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
    
            // Create role-specific entry
            if ($request->role === 'student') {
                Student::create([
                    'user_id' => $user->id,
                    'student_id' => 'S' . date('Y') . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'grade' => $request->grade ?? null,
                    'recovery_email' => $request->recovery_email ?? null,
                ]);
            } elseif ($request->role === 'teacher') {
                Teacher::create([
                    'user_id' => $user->id,
                    'employee_id' => 'T' . date('Y') . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'department' => $request->department ?? null,
                    'position' => $request->position ?? null,
                    'specialization' => $request->specialization ?? null,
                ]);
            } elseif ($request->role === 'administrator') {
                Administrator::create([
                    'user_id' => $user->id,
                    'admin_level' => $request->admin_level ?? 'basic',
                    'department' => $request->department ?? 'general',
                ]);
            } elseif ($request->role === 'librarian') {
                Librarian::create([
                    'user_id' => $user->id,
                    'staff_id' => 'L' . date('Y') . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                ]);
            }
    
            DB::commit();
    
            // Include the plaintext password in the response
            // This is the ONLY time the plaintext password will be available
            $userData = $user->toArray();
            $userData['plaintext_password'] = $request->password;
    
            return response()->json([
                'message' => 'User created successfully',
                'user' => $userData,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'User creation failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        $userData = $user->toArray();
        
        // Include role-specific data
        if ($user->isStudent()) {
            $userData['student'] = $user->student;
        } elseif ($user->isTeacher()) {
            $userData['teacher'] = $user->teacher;
        } elseif ($user->isAdministrator()) {
            $userData['administrator'] = $user->administrator;
        } elseif ($user->isLibrarian()) {
            $userData['librarian'] = $user->librarian;
        }
        
        return response()->json($userData);
    }

    /**
     * Update the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
        ]);
        
        DB::beginTransaction();
        try {
            // Update user data
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            
            if ($request->has('password') && $request->password) {
                $user->password = Hash::make($request->password);
            }
            
            $user->save();
            
            // Update role-specific data
            if ($user->isStudent() && $user->student) {
                if ($request->has('grade')) {
                    $user->student->grade = $request->grade;
                }
                if ($request->has('recovery_email')) {
                    $user->student->recovery_email = $request->recovery_email;
                }
                $user->student->save();
            } elseif ($user->isTeacher() && $user->teacher) {
                if ($request->has('department')) {
                    $user->teacher->department = $request->department;
                }
                if ($request->has('position')) {
                    $user->teacher->position = $request->position;
                }
                if ($request->has('specialization')) {
                    $user->teacher->specialization = $request->specialization;
                }
                $user->teacher->save();
            } elseif ($user->isAdministrator() && $user->administrator) {
                if ($request->has('admin_level')) {
                    $user->administrator->admin_level = $request->admin_level;
                }
                if ($request->has('department')) {
                    $user->administrator->department = $request->department;
                }
                $user->administrator->save();
            }
            
            DB::commit();
            
            $userData = $user->fresh()->toArray();
            
            // Include the plaintext password in the response if it was updated
            if ($request->has('password') && $request->password) {
                $userData['plaintext_password'] = $request->password;
            }
            
            return response()->json([
                'message' => 'User updated successfully',
                'user' => $userData,
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'User update failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        try {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User deletion failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reset user's password and return the new plaintext password.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetPassword($id)
    {
        $user = User::findOrFail($id);
        
        // Generate a random password
        $newPassword = Str::random(10);
        
        // Update user password
        $user->password = Hash::make($newPassword);
        $user->save();
        
        return response()->json([
            'message' => 'Password reset successfully',
            'user_id' => $user->id,
            'user_email' => $user->email,
            'new_password' => $newPassword,
        ]);
    }
}