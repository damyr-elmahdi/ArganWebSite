<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Administrator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:student,teacher,administrator',
        ]);

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
                ]);
            } elseif ($request->role === 'administrator') {
                Administrator::create([
                    'user_id' => $user->id,
                    'admin_level' => $request->admin_level ?? 'basic',
                    'department' => $request->department ?? 'general',
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $user->createToken('api-token')->plainTextToken,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Set expiration time based on remember me checkbox
        $expiresAt = $request->remember ? null : now()->addMinutes(config('sanctum.expiration', 60));

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('api-token', ['*'], $expiresAt)->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $userData = $user->toArray();
        
        if ($user->isStudent()) {
            $userData['student'] = $user->student;
        } elseif ($user->isTeacher()) {
            $userData['teacher'] = $user->teacher;
        } elseif ($user->isAdministrator()) {
            $userData['administrator'] = $user->administrator;
        }
        
        return response()->json($userData);
    }

    /**
     * Update recovery email for a student user
     */
    public function updateRecoveryEmail(Request $request)
    {
        $request->validate([
            'recovery_email' => 'required|email',
        ]);

        $user = $request->user();
        
        if (!$user->isStudent()) {
            return response()->json(['message' => 'Only student accounts can update recovery email'], 403);
        }

        $student = $user->student;
        $student->recovery_email = $request->recovery_email;
        $student->save();

        return response()->json([
            'message' => 'Recovery email updated successfully',
            'student' => $student
        ]);
    }
}