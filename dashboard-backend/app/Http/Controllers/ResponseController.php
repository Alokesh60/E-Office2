<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ResponseController extends Controller
{
  public function takeAction(Request $request)
  {
    $submission = \App\Models\Response::find($request->id);

    if (!$submission) {
      return response()->json(['error' => 'Not found'], 404);
    }

    $action = $request->action; // approve / reject / back

    if ($action === 'approve') {
      $submission->current_step++;

      // if last step → final approve
      if ($submission->current_step >= count($submission->form->workflow)) {
        $submission->status = 'approved';
      }
    }

    if ($action === 'reject') {
      $submission->status = 'rejected';
    }

    if ($action === 'back') {
      $submission->current_step = max(0, $submission->current_step - 1);
    }

    $submission->save();

    return response()->json($submission);
  }
}
