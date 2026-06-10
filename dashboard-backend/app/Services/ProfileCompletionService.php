<?php

namespace App\Services;

use App\Models\User;

class ProfileCompletionService
{
    /**
     * Each field carries equal weight.
     * Only fields that exist in the users table are checked.
     */
    private array $fields = [
        'name',
        'email',
        'avatar',
        'department',
        'programme',
        'semester',
        'student_id',
    ];

    public function calculate(User $user): int
    {
        $total  = count($this->fields);
        $filled = 0;

        foreach ($this->fields as $field) {
            if (!empty($user->{$field})) {
                $filled++;
            }
        }

        if ($total === 0) return 0;

        return (int) round(($filled / $total) * 100);
    }
}