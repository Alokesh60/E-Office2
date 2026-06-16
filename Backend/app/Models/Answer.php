<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = ['response_id', 'field_id', 'answer_text'];

    public function field()
    {
        return $this->belongsTo(\App\Models\FormField::class);
    }
}
