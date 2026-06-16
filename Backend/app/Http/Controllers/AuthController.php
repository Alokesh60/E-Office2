<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['student', 'staff', 'admin'])],
            'designation' => ['required_if:role,staff', 'nullable', 'string', 'max:255'],
            'student_id' => ['required_if:role,student', 'nullable', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $user = User::create([
            'name' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
            'designation' => $request->role === 'staff' ? $request->designation : null,
            'student_id' => $request->role === 'student' ? $request->student_id : null,
            'password' => $request->password,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully'
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }
}
