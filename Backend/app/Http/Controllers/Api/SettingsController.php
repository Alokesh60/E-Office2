<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\NotificationSetting;

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
            'student_id'  => $user->student_id,
            'avatar'      => $user->avatar
                                ? asset('storage/' . $user->avatar)
                                : null,
            'department'  => $user->department,
            'programme'   => $user->programme,
            'semester'    => $user->semester,
        ]);
    }

    /**
     * PUT /api/settings/profile
     * Updates department, programme, semester, name
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'department'  => 'sometimes|string|max:255',
            'programme'   => 'sometimes|string|max:255',
            'semester'    => 'sometimes|string|max:255',
        ]);

        $user = $request->user();

        $user->update($request->only('name', 'department', 'programme', 'semester'));

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

    /**
     * GET /api/settings/devices
     * Lists all active tokens (devices) for the current user
     */
    public function getDevices(Request $request)
    {
        $user        = $request->user();
        $currentToken = $request->user()->currentAccessToken();

        $devices = $user->tokens()->get()->map(function ($token) use ($currentToken) {
            return [
                'id'         => $token->id,
                'name'       => $token->name,
                'last_used'  => $token->last_used_at
                                    ? $token->last_used_at->diffForHumans()
                                    : 'Never',
                'created_at' => $token->created_at->diffForHumans(),
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
}