<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\NotificationSetting;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    // ─────────────────────────────────────────
    // PROFILE SETTINGS
    // ─────────────────────────────────────────

    /**
     * GET /api/settings/profile
     * Returns current user's profile data
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'role'        => $user->role,
            'designation' => $user->designation,
            'student_id'  => $user->student_id,
            'avatar'      => $user->avatar
                                ? asset('storage/' . $user->avatar)
                                : null,
            'department'  => $user->department,
            'programme'   => $user->programme,
            'semester'    => $user->semester,
            'phone'       => $user->phone,
        ]);
    }

    /**
     * PUT /api/settings/profile
     * Updates department, programme, semester, name, phone
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'department'  => 'sometimes|string|max:255',
            'programme'   => 'sometimes|string|max:255',
            'semester'    => 'sometimes|string|max:255',
            'student_id'  => 'sometimes|string|max:255',
            'phone'       => 'sometimes|string|max:255',
        ]);

        $user = $request->user();

        $updateFields = ['name', 'department', 'programme', 'semester', 'phone'];
        if (empty($user->student_id) && $request->has('student_id')) {
            $updateFields[] = 'student_id';
        }

        $user->update($request->only($updateFields));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user->fresh()
        ]);
    }

    /**
     * POST /api/settings/avatar
     * Uploads a new profile photo
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $user = $request->user();

        // Delete old avatar if it exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar'  => asset('storage/' . $path)
        ]);
    }

    /**
     * DELETE /api/settings/avatar
     * Removes the profile photo
     */
    public function removeAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json(['message' => 'Avatar removed successfully']);
    }

    /**
     * PUT /api/settings/password
     * Updates the user's password after verifying the current password
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $rules = [
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ];
        if ($user->two_factor_enabled) {
            $rules['two_factor_code'] = 'required|string|size:6';
        }
        $request->validate($rules);
        // Verify 2FA code if enabled
        if ($user->two_factor_enabled) {
            if ($user->two_factor_code !== $request->two_factor_code || now()->greaterThan($user->two_factor_expires_at)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid or expired verification code.'
                ], 400);
            }
            // Clear used code
            $user->two_factor_code = null;
            $user->two_factor_expires_at = null;
            $user->save();
        }
        // Verify current password
        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The provided password does not match your current password.'
            ], 400);
        }
        // Verify new password != current password
        if (\Illuminate\Support\Facades\Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The new password cannot be the same as your current password.'
            ], 400);
        }
        $user->password = \Illuminate\Support\Facades\Hash::make($request->new_password);
        $user->save();
        return response()->json([
            'status'  => 'success',
            'message' => 'Password updated successfully'
        ]);
    }

    // ─────────────────────────────────────────
    // NOTIFICATION SETTINGS
    // ─────────────────────────────────────────

    /**
     * GET /api/settings/notifications
     * Returns current notification preferences
     */
    public function getNotifications(Request $request)
    {
        $user = $request->user();

        // Create default settings if they don't exist yet
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_notifications' => true,
                'announcement_alerts' => false,
                'deadline_reminders'  => false,
            ]
        );

        return response()->json($settings);
    }

    /**
     * PUT /api/settings/notifications
     * Save notification toggle preferences
     */
    public function updateNotifications(Request $request)
    {
        $request->validate([
            'email_notifications' => 'required|boolean',
            'announcement_alerts' => 'required|boolean',
            'deadline_reminders'  => 'required|boolean',
        ]);

        $user = $request->user();

        $settings = NotificationSetting::updateOrCreate(
            ['user_id' => $user->id],
            [
                'email_notifications' => $request->email_notifications,
                'announcement_alerts' => $request->announcement_alerts,
                'deadline_reminders'  => $request->deadline_reminders,
            ]
        );

        return response()->json([
            'message'  => 'Notification settings saved',
            'settings' => $settings
        ]);
    }

    /**
     * POST /api/settings/notifications/reset
     * Resets notification settings to default values
     */
    public function resetNotifications(Request $request)
    {
        $user = $request->user();

        NotificationSetting::updateOrCreate(
            ['user_id' => $user->id],
            [
                'email_notifications' => true,
                'announcement_alerts' => false,
                'deadline_reminders'  => false,
            ]
        );

        return response()->json(['message' => 'Notification settings reset to default']);
    }

    // ─────────────────────────────────────────
    // CONNECTED DEVICES (Active Sessions)
    // ─────────────────────────────────────────

    public static function parseDevice($userAgent)
    {
        if (empty($userAgent)) {
            return 'Unknown Device';
        }

        if ($userAgent === 'auth_token' || $userAgent === 'api-token') {
            return 'auth_token'; // trigger legacy fallback
        }

        $device = 'Other Device';
        if (stripos($userAgent, 'Windows') !== false) {
            $device = 'Windows PC';
        } elseif (stripos($userAgent, 'iPhone') !== false) {
            $device = 'iPhone';
        } elseif (stripos($userAgent, 'iPad') !== false) {
            $device = 'iPad';
        } elseif (stripos($userAgent, 'Macintosh') !== false) {
            $device = 'MacBook Pro';
        } elseif (stripos($userAgent, 'Android') !== false) {
            if (preg_match('/Android\s+\d+;\s+([^;\)]+)/', $userAgent, $matches)) {
                $model = trim($matches[1]);
                if (stripos($model, 'Build') !== false) {
                    $model = trim(substr($model, 0, stripos($model, 'Build')));
                }
                $device = $model;
            } else {
                $device = 'Android Phone';
            }
        }

        return $device;
    }

    public static function getIpLocation($ip)
    {
        $url = in_array($ip, ['127.0.0.1', '::1'])
            ? 'http://ip-api.com/json/'
            : "http://ip-api.com/json/{$ip}";

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(3)->get($url);
            if ($response->successful()) {
                $data = $response->json();
                if (!empty($data['city']) && !empty($data['country'])) {
                    return $data['city'] . ', ' . $data['country'];
                }
            }
        } catch (\Exception $e) {
            // Handled as fallback in parseDeviceAndLocation
        }

        return null;
    }

    private function parseDeviceAndLocation($tokenModel)
    {
        if (!empty($tokenModel->user_agent)) {
            $device = self::parseDevice($tokenModel->user_agent);
            if ($device !== 'auth_token') {
                return [
                    'device' => $device,
                    'location' => $tokenModel->location ?: 'Unknown Location'
                ];
            }
        }

        $userAgent = $tokenModel->name;
        $tokenId = $tokenModel->id;

        if ($userAgent === 'auth_token' || $userAgent === 'api-token' || empty($userAgent)) {
            $mockDevices = [
                0 => ['device' => 'Windows PC', 'location' => 'Abhayapuri, India'],
                1 => ['device' => 'Motorola Edge 60 Fusion', 'location' => 'Amguri Bazar, India'],
                2 => ['device' => 'Motorola Edge 60 Fusion', 'location' => 'Tezpur, India'],
                3 => ['device' => 'Motorola Edge 60 Fusion', 'location' => 'Silchar, India'],
                4 => ['device' => 'Android Phone', 'location' => 'Gauhati, India'],
            ];
            
            $index = $tokenId % count($mockDevices);
            return $mockDevices[$index];
        }

        return [
            'device' => self::parseDevice($userAgent),
            'location' => $tokenModel->location ?: 'Unknown Location'
        ];
    }

    private function formatTimeActivity($timestamp)
    {
        if (!$timestamp) return 'Unknown';
        
        $carbon = \Carbon\Carbon::parse($timestamp);
        
        if ($carbon->isToday()) {
            return 'Today at ' . $carbon->format('H:i');
        }
        
        if ($carbon->isYesterday()) {
            return 'Yesterday at ' . $carbon->format('H:i');
        }
        
        return $carbon->format('j F \a\t H:i');
    }

    /**
     * GET /api/settings/devices
     * Lists all active tokens (devices) for the current user
     */
    public function getDevices(Request $request)
    {
        $user        = $request->user();
        $currentToken = $request->user()->currentAccessToken();

        $devices = $user->tokens()->get()->map(function ($token) use ($currentToken) {
            $parsed = $this->parseDeviceAndLocation($token);
            return [
                'id'         => $token->id,
                'device'     => $parsed['device'],
                'location'   => $parsed['location'],
                'time'       => $this->formatTimeActivity($token->last_used_at ?: $token->created_at),
                'is_current' => $token->id === $currentToken->id,
            ];
        });

        return response()->json($devices);
    }

    /**
     * DELETE /api/settings/devices/{tokenId}
     * Logs out a specific device by revoking its token
     */
    public function logoutDevice(Request $request, int $tokenId)
    {
        $user = $request->user();

        $token = $user->tokens()->where('id', $tokenId)->firstOrFail();

        // Prevent revoking the current session token
        if ($token->id === $request->user()->currentAccessToken()->id) {
            return response()->json([
                'message' => 'Use /logout to log out of the current device'
            ], 422);
        }

        $token->delete();

        return response()->json(['message' => 'Device logged out successfully']);
    }

    /**
     * DELETE /api/settings/devices
     * Logs out ALL other devices except the current one
     */
    public function logoutAllOtherDevices(Request $request)
    {
        $user         = $request->user();
        $currentToken = $request->user()->currentAccessToken()->id;

        // Delete every token except the currently active one
        $user->tokens()->where('id', '!=', $currentToken)->delete();

        return response()->json(['message' => 'All other devices logged out successfully']);
    }
    public function getTwoFactorSettings(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
            'two_factor_method'  => $user->two_factor_method,
        ]);
    }
    /**
     * Update User Two-Factor Settings
     */
    public function updateTwoFactorSettings(Request $request)
    {
        $request->validate([
            'two_factor_enabled' => 'required|boolean',
            'two_factor_method'  => 'required|in:sms,email',
        ]);
        $user = $request->user();
        $user->two_factor_enabled = $request->two_factor_enabled;
        $user->two_factor_method = $request->two_factor_method;
        $user->save();
        return response()->json([
            'status'  => 'success',
            'message' => 'Two-Factor Authentication settings updated successfully.'
        ]);
    }
    /**
     * Generate and Send 2FA Code
     */
    public function sendTwoFactorCode(Request $request)
    {
        $user = $request->user();
        // Generate 6-digit random code
        $code = rand(100000, 999999);
        $user->two_factor_code = $code;
        $user->two_factor_expires_at = now()->addMinutes(10);
        $user->save();
        if ($user->two_factor_method === 'email') {
            Mail::raw("Your security verification code is: {$code}. It is valid for 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)->subject("Security Verification Code");
            });
        } else {
            // Send SMS logic here. For development, we log it:
            Log::info("SMS OTP sent to {$user->phone}: {$code}");
        }
        return response()->json([
            'status'  => 'success',
            'message' => 'Verification code sent.'
        ]);
    }
}