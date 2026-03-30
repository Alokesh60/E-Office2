<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
  protected $fillable = [
    'form_id',
    'label',
    'field_name',
    'field_type',
    'required',
    'options',
    'validation',
    'field_order'
  ];

  public function form()
  {
    return $this->belongsTo(Form::class);
  }
}
