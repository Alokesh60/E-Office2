<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    public function logs()
    {
        return $this->hasMany(\App\Models\ApprovalLog::class);
    }

    protected $fillable = [
        'form_id',
        'user_id',
        'status',
        'current_step',
    ];

    public function answers()
    {
        return $this->hasMany(\App\Models\Answer::class);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
