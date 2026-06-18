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
    /**
     * Fetch public holidays from external API and normalise shape.
     * Cached per year for 24 hours.
     */
    private function getHolidays(): \Illuminate\Support\Collection
    {
        return Cache::remember('holidays_' . now()->year, 86400, function () {
            $response = Http::get(
                "https://date.nager.at/api/v3/PublicHolidays/" . now()->year . "/IN"
            );

            if (!$response->successful()) return collect([]);

            return collect($response->json())->map(function ($h) {
                return [
                    'id'          => null,
                    'title'       => $h['localName'],
                    'description' => null,
                    'date'        => $h['date'],
                    'type'        => 'holiday',
                    'user_id'     => null,
                ];
            });
        });
    }

    /**
     * Fetch DB calendar events for a user and normalise shape to match holidays.
     * Includes global events (user_id = null) and user-specific events.
     */
    private function getDbEvents(int $userId): \Illuminate\Support\Collection
    {
        return CalendarEvent::where(function ($q) use ($userId) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $userId);
        })->get()->map(function ($event) {
            return [
                'id'          => $event->id,
                'title'       => $event->title,
                'description' => $event->description,
                'date'        => $event->date,
                'type'        => $event->type,
                'user_id'     => $event->user_id,
            ];
        });
    }

    private function getUserActivityLogs(int $userId): \Illuminate\Support\Collection
    {
        $responses = \App\Models\Response::with('form')
            ->where('user_id', $userId)
            ->get();

        $activities = collect();

        foreach ($responses as $response) {
            $activities->push([
                'id'             => 'submit_' . $response->id,
                'title'          => 'Form Submitted',
                'description'    => 'You submitted form: ' . ($response->form->title ?? 'Untitled Form'),
                'status'         => 'submitted',
                'created_at'     => $response->created_at->toISOString(),
                'time_formatted' => $response->created_at->diffForHumans(),
            ]);
        }

        $logs = \App\Models\ApprovalLog::with('response.form')
            ->whereIn('response_id', $responses->pluck('id'))
            ->get();

        foreach ($logs as $log) {
            $actionLabel = '';
            $statusType = $log->action;
            if ($log->action === 'approved') {
                $actionLabel = 'Form Approved';
                $desc = 'Your form "' . ($log->response->form->title ?? 'Form') . '" was approved by ' . $log->role;
            } elseif ($log->action === 'rejected') {
                $actionLabel = 'Form Rejected';
                $desc = 'Your form "' . ($log->response->form->title ?? 'Form') . '" was rejected by ' . $log->role;
            } elseif ($log->action === 'sent_back') {
                $actionLabel = 'Form Sent Back';
                $desc = 'Your form "' . ($log->response->form->title ?? 'Form') . '" was sent back by ' . $log->role;
            } else {
                $actionLabel = 'Form Forwarded';
                $desc = 'Your form "' . ($log->response->form->title ?? 'Form') . '" was forwarded by ' . $log->role;
            }

            $activities->push([
                'id'             => 'log_' . $log->id,
                'title'          => $actionLabel,
                'description'    => $desc,
                'status'         => $statusType,
                'created_at'     => $log->created_at->toISOString(),
                'time_formatted' => $log->created_at->diffForHumans(),
            ]);
        }

        return $activities->sortByDesc('created_at')->values()->take(10);
    }

    public function index(Request $request, ApplicationStatsService $statsService)
    {
        $userId = $request->user()->id;

        $calendar = $this->getDbEvents($userId)
            ->merge($this->getHolidays())
            ->sortBy('date')
            ->values();

        $stats = $statsService->getUserStats($userId);
        if ($request->user()->role === 'admin') {
            $stats = [
                'total_users' => \App\Models\User::count(),
                'total_applications' => \App\Models\Response::count(),
                'pending_applications' => \App\Models\Response::where('status', 'pending')->count(),
                'rejected_applications' => \App\Models\Response::where('status', 'rejected')->count(),
            ];
        }

        return response()->json([
            'stats' => $stats,

            'activity' => $this->getUserActivityLogs($userId),

            'announcements' => Announcement::where('is_active', 1)
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->latest()
                ->limit(5)
                ->get(),

            'calendar' => $calendar,
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
            $this->getUserActivityLogs($request->user()->id)
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

    /**
     * Returns merged DB events + holidays, same shape as index().
     */
    public function calendar(Request $request)
    {
        $userId = $request->user()->id;

        $calendar = $this->getDbEvents($userId)
            ->merge($this->getHolidays())
            ->sortBy('date')
            ->values();

        return response()->json($calendar);
    }
}