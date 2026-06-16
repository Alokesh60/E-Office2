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
    'field_order'
  ];

  protected $casts = [
    'required' => 'boolean',
    'options' => 'array',
  ];

  public function form()
  {
    return $this->belongsTo(Form::class);
  }
}
