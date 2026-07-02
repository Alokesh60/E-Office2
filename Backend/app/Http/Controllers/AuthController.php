<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

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
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }
     public function sendForgotPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);
        // Generate a 6-digit random code
        $otp = rand(100000, 999999);
        // Store OTP in password_reset_tokens table (upsert)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($otp),
                'created_at' => Carbon::now()
            ]
        );
        // Send OTP via email (this will log in storage/logs/laravel.log by default in dev)
        Mail::raw("Your OTP for password reset is: {$otp}. It is valid for 15 minutes.", function ($message) use ($request) {
            $message->to($request->email)
                    ->subject("Password Reset OTP");
        });
        return response()->json([
            'status' => 'success',
            'message' => 'OTP has been sent to your email.'
        ]);
    }
    /**
     * Verify the 6-digit OTP and issue a Sanctum access token.
     */
    public function verifyForgotPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);
        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();
        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'No OTP request found for this email.'
            ], 400);
        }
        // Verify expiry (15 minutes limit)
        $expiryTime = Carbon::parse($record->created_at)->addMinutes(15);
        if (Carbon::now()->greaterThan($expiryTime)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'status' => 'error',
                'message' => 'OTP has expired. Please request a new one.'
            ], 400);
        }
        // Verify OTP hash
        if (!Hash::check($request->otp, $record->token)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP code. Please try again.'
            ], 400);
        }
        // Delete used token record
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        // Get user and generate a Sanctum API token
        $user = User::where('email', $request->email)->firstOrFail();
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
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }
}
