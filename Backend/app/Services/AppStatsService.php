<?php

namespace App\Services;

use App\Models\Application;

class ApplicationStatsService
{
    public function getUserStats($userId)
    {
        $total = Application::where('user_id', $userId)->count();

        $approved = Application::where('user_id', $userId)
            ->where('status', 'approved')
            ->count();

        $rejected = Application::where('user_id', $userId)
            ->where('status', 'rejected')
            ->count();

        $pending = Application::where('user_id', $userId)
            ->whereIn('status', ['submitted','in_review'])
            ->count();

        return [
            'total' => $total,
            'approved' => $this->percent($approved, $total),
            'rejected' => $this->percent($rejected, $total),
            'pending' => $this->percent($pending, $total),
        ];
    }

    private function percent($count, $total)
    {
        if ($total === 0) return 0;
        return round(($count / $total) * 100);
    }
}