<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
  protected $fillable = ['name', 'description', 'created_by', 'is_active'];

  public function fields()
  {
    return $this->hasMany(FormField::class);
  }

  public function responses()
  {
    return $this->hasMany(\App\Models\Response::class);
  }
}
