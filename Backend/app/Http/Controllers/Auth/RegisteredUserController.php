<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'role' => ['sometimes', 'required', Rule::in(['student', 'staff', 'admin'])],
            'designation' => ['required_if:role,staff', 'nullable', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $role = $request->input('role', 'student');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
            'role' => $role,
            'designation' => $role === 'staff' ? $request->designation : null,
        ]);

        event(new Registered($user));

        $userAgent = $request->header('User-Agent') ?: 'Unknown Device';
        $deviceName = \App\Http\Controllers\Api\SettingsController::parseDevice($userAgent);

        $tokenResult = $user->createToken($deviceName);
        $tokenModel = $tokenResult->accessToken;

        $tokenModel->ip_address = $request->ip();
        $tokenModel->user_agent = $userAgent;
        $tokenModel->location = \App\Http\Controllers\Api\SettingsController::getIpLocation($request->ip());
        $tokenModel->save();

        $token = $tokenResult->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }
}
