<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;
use App\Models\Response;
use App\Models\Answer;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class FormController extends Controller
{
  public function store(Request $request)
  {
    $form = \App\Models\Form::create([
      'name' => $request->name,
      'description' => $request->description,
      'created_by' => $request->created_by,
      'workflow' => $request->workflow,
    ]);

    return response()->json($form);
  }

  public function deleteFields($id)
  {
    \App\Models\FormField::where('form_id', $id)->delete();

    return response()->json(['message' => 'Fields deleted successfully']);
  }

  public function destroy($id)
  {
    $form = \App\Models\Form::findOrFail($id);
    $form->delete();

    return response()->json(['message' => 'Form deleted successfully']);
  }

  public function update(Request $request, $id)
  {
    $form = \App\Models\Form::findOrFail($id);

    $form->update([
      'name' => $request->name,
      'description' => $request->description,
      'workflow' => $request->workflow,
    ]);

    $form->fields()->delete();

    return response()->json([
      'message' => 'Form updated successfully',
      'id' => $form->id
    ]);
  }

  public function index()
  {
    return \App\Models\Form::with('fields')->get();
  }

  public function responses($id)
  {
    $form = \App\Models\Form::with([
      'fields',
      'responses.answers.field'
    ])->findOrFail($id);

    return response()->json($form);
  }
  /**
   * Show form to user
   */
  public function show($id)
  {
    $form = \App\Models\Form::with('fields')->findOrFail($id);

    return response()->json($form);
  }

  /**
   * Submit form response
   */
  public function submit(Request $request, $id)
  {
    // dd($request->all(), $request->files->all());
    $form = \App\Models\Form::with('fields')->findOrFail($id);

    \Illuminate\Support\Facades\DB::beginTransaction();

    try {
      $response = \App\Models\Response::create([
        'form_id' => $id,
        'status' => 'pending',
        'current_step' => 0,
      ]);

      foreach ($form->fields as $field) {
        $key = 'field_' . $field->id;

        if ($request->hasFile($key)) {
          $file = $request->file($key);
          $path = $file->store('uploads', 'public');
          $answer = $path;
        } else {
          $answer = $request->input($key);

          if (is_array($answer)) {
            $answer = json_encode($answer);
          }
        }

        \App\Models\Answer::create([
          'response_id' => $response->id,
          'field_id' => $field->id,
          'answer_text' => $answer
        ]);
      }

      \Illuminate\Support\Facades\DB::commit();

      return response()->json(['message' => 'Form submitted successfully']);
    } catch (\Exception $e) {
      \Illuminate\Support\Facades\DB::rollback();

      return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
    }
  }
}
