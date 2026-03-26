<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ApplicationStatsService;
use App\Models\ApplicationLog;
use App\Models\Announcement;
use App\Models\CalendarEvent;

class DashboardController extends Controller
{
    public function index(Request $request, ApplicationStatsService $statsService)
    {
        $userId = $request->user()->id;

        return response()->json([
            'stats' => $statsService->getUserStats($userId),

            'activity' => ApplicationLog::where('actor_id', $userId)
                ->latest()
                ->limit(10)
                ->get(),

            'announcements' => Announcement::where('is_active', 1)
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->latest()
                ->limit(5)
                ->get(),

            'calendar' => CalendarEvent::where(function ($q) use ($userId) {
                $q->whereNull('user_id')
                  ->orWhere('user_id', $userId);
            })
            ->orderBy('date')
            ->get()
        ]);
    }

    public function stats(Request $request, ApplicationStatsService $statsService)
    {
        return response()->json(
            $statsService->getUserStats($request->user()->id)
        );
    }

    public function activity(Request $request)
    {
        return response()->json(
            ApplicationLog::where('actor_id', $request->user()->id)
                ->latest()
                ->limit(10)
                ->get()
        );
    }

    public function announcements()
    {
        return response()->json(
            Announcement::where('is_active', 1)
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->latest()
                ->get()
        );
    }

    public function calendar(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json(
            CalendarEvent::where(function ($q) use ($userId) {
                $q->whereNull('user_id')
                  ->orWhere('user_id', $userId);
            })
            ->orderBy('date')
            ->get()
        );
    }
}