<?php

namespace App\Services;

use App\Models\Response;

class ApplicationStatsService
{
    public function getUserStats($userId)
    {
        $total = Response::where('user_id', $userId)->count();

        $approved = Response::where('user_id', $userId)
            ->where('status', 'approved')
            ->count();

        $rejected = Response::where('user_id', $userId)
            ->where('status', 'rejected')
            ->count();

        // Pending applications
        $pending = Response::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        // Sent back applications (has ever had a sent_back log)
        $sentBack = Response::where('user_id', $userId)
            ->whereHas('logs', function ($q) {
                $q->where('action', 'sent_back');
            })
            ->count();

        // To keep pending clean and non-overlapping if sent back is counted separately:
        $pendingClean = max(0, $pending - $sentBack);

        return [
            'total'     => $total,
            'approved'  => $this->percent($approved, $total),
            'rejected'  => $this->percent($rejected, $total),
            'pending'   => $this->percent($pendingClean, $total),
            'sent_back' => $this->percent($sentBack, $total),
        ];
    }

    private function percent($count, $total)
    {
        if ($total === 0) return 0;
        return round(($count / $total) * 100);
    }
}
