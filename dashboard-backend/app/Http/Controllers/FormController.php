<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;

class FormController extends Controller
{
  public function show($id)
  {
    $form = Form::with('fields')->findOrFail($id);

    return view('form.fill', compact('form'));
  }
}
