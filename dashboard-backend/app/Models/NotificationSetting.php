<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'announcement_alerts',
        'deadline_reminders',
    ];

    protected $casts = [
        'email_notifications'  => 'boolean',
        'announcement_alerts'  => 'boolean',
        'deadline_reminders'   => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}