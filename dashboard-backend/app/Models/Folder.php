<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = [
        'name',
        'user_id'
    ];

    
    public function files()
    {
        return $this->hasMany(File::class);
    }

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}