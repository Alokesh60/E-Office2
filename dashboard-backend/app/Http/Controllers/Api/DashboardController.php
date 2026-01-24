<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Announcement;
use App\Models\Event;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $filled = 0;
        if ($user->name) $filled++;
        if ($user->email) $filled++;
        if ($user->role) $filled++;

        $profileCompletion = intval(($filled / 3) * 100);

        $applications = Application::where('user_id', $user->id)->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' =>   $user->role,
                'profileCompletion' => $profileCompletion
            ],
            'applications' => [
                'total' => $applications->count(),
                'pending' => $applications->where('status', 'Pending')->count(),
                'accepted' => $applications->where('status', 'Accepted')->count(),
                'rejected' => $applications->where('status', 'Rejected')->count(),
            ],
            'announcements' => Announcement::where('active', true)->get(),
            'calendar' => Event::all()
        ]);
    }
}
