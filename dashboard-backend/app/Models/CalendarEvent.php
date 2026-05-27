<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'date',
        'user_id',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];
}