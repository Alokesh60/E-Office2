<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ApplicationStatsService;
use App\Models\ApplicationLog;
use App\Models\Announcement;
use App\Models\CalendarEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request, ApplicationStatsService $statsService)
    {
        $userId = $request->user()->id;

        // fetch holidays from calender api
        $holidays = Cache::remember('holidays_' . now()->year, 86400, function () {

            $response = Http::get("https://date.nager.at/api/v3/PublicHolidays/" . now()->year . "/IN");

            if (!$response->successful()) return collect([]);

            return collect($response->json())->map(function ($h) {
                return [
                    'title' => $h['localName'],
                    'date' => $h['date'],
                    'type' => 'holiday'
                ];
            });
        });

        // fetch calender events from db
        $events = CalendarEvent::where(function ($q) use ($userId) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $userId);
        })->get();

        
        $calendar = $events->merge($holidays)
                           ->sortBy('date')
                           ->values();

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

            'calendar' => $calendar
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

        $events = CalendarEvent::where(function ($q) use ($userId) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $userId);
        })->get();

        return response()->json($events);
    }
}