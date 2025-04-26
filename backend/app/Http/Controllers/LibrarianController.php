<?php

namespace App\Http\Controllers;

use App\Models\Librarian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LibrarianController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('can:manage-librarians')->except(['profile']);
    }

    // List all librarians (for administrators)
    public function index()
    {
        $librarians = Librarian::with('user')->get();
        return response()->json($librarians);
    }

    // Get current librarian's profile
    public function profile(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'librarian' && $user->role !== 'administrator') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $librarian = Librarian::with('user')->where('user_id', $user->id)->first();
        if (!$librarian) {
            return response()->json(['message' => 'Librarian profile not found'], 404);
        }

        return response()->json($librarian);
    }

    // Create a new librarian account
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'staff_id' => 'required|string|max:255|unique:librarians'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create user with librarian role
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'librarian',
        ]);

        // Create librarian record linked to the user
        $librarian = Librarian::create([
            'user_id' => $user->id,
            'staff_id' => $request->staff_id,
        ]);

        return response()->json([
            'message' => 'Librarian created successfully',
            'librarian' => $librarian->load('user')
        ], 201);
    }

    // Show a specific librarian's details
    public function show(Librarian $librarian)
    {
        return response()->json($librarian->load('user'));
    }

    // Update librarian information
    public function update(Request $request, Librarian $librarian)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($librarian->user_id),
            ],
            'staff_id' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('librarians')->ignore($librarian->id),
            ],
            'password' => 'sometimes|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update user information
        $user = $librarian->user;
        
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        // Update librarian information
        if ($request->has('staff_id')) {
            $librarian->staff_id = $request->staff_id;
            $librarian->save();
        }

        return response()->json([
            'message' => 'Librarian updated successfully',
            'librarian' => $librarian->fresh()->load('user')
        ]);
    }

    // Delete a librarian account
    public function destroy(Librarian $librarian)
    {
        // Delete the user which will cascade delete the librarian via foreign key
        $librarian->user->delete();

        return response()->json([
            'message' => 'Librarian deleted successfully'
        ]);
    }
}