<?php

namespace App\Services;

use App\Models\User;

class ProfileCompletionService
{
    public function calculate(User $user)
    {
        $score = 0;

        if ($user->email) $score += 20;
        if ($user->address) $score += 20;
        if ($user->phone) $score += 20;
        if ($user->avatar) $score += 20;
        if ($user->signature_sample) $score += 20;

        return $score;
    }
}