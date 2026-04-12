<?php

namespace App\Http\Controllers;

use App\Models\ApprovalLog;
use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Form;

class SubmissionController extends Controller
{
  public function sendBack(Request $request, $id)
  {
    $response = \App\Models\Response::findOrFail($id);
    $form = \App\Models\Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow) ? json_decode($form->workflow, true) : $form->workflow;

    if ($response->status === 'approved') {
      return response()->json(['message' => 'Already approved'], 400);
    }

    if ($response->status === 'rejected') {
      return response()->json(['message' => 'Already rejected'], 400);
    }

    if ($response->current_step > 0) {
      $currentRole = $workflow[$response->current_step];

      $response->current_step -= 1;
      $response->status = 'pending';
      $response->save();

      \App\Models\ApprovalLog::create([
        'response_id' => $response->id,
        'role' => $currentRole,
        'action' => 'sent_back',
        'comment' => $request->comment
      ]);

      return response()->json([
        'message' => 'Submission sent back successfully',
        'current_step' => $response->current_step
      ]);
    }

    return response()->json(['message' => 'Submission is already at the first step'], 400);
  }

  public function approve(Request $request, $id)
  {
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    if ($response->status === 'approved') {
      return response()->json(['message' => 'Submission already approved'], 400);
    }

    if ($response->status === 'rejected') {
      return response()->json(['message' => 'Submission already rejected'], 400);
    }

    $workflow = is_string($form->workflow)
      ? json_decode($form->workflow, true)
      : $form->workflow;

    $currentRole = $workflow[$response->current_step] ?? 'unknown';

    // ✅ If final step
    if ($response->current_step === count($workflow) - 1) {

      ApprovalLog::create([
        'response_id' => $response->id,
        'role' => $currentRole,
        'action' => 'approved',
        'comment' => $request->comment
      ]);

      $response->status = 'approved';
      $response->save();

      return response()->json([
        'message' => 'Submission approved successfully',
        'status' => 'approved'
      ]);
    }

    // ✅ Normal forward
    ApprovalLog::create([
      'response_id' => $response->id,
      'role' => $currentRole,
      'action' => 'approved',
      'comment' => $request->comment
    ]);

    $response->current_step += 1;
    $response->save();

    return response()->json([
      'message' => 'Submission approved and forwarded',
      'current_step' => $response->current_step
    ]);
  }

  public function reject(Request $request, $id)
  {
    $response = \App\Models\Response::findOrFail($id);
    $form = \App\Models\Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow) ? json_decode($form->workflow, true) : $form->workflow;
    $currentRole = $workflow[$response->current_step] ?? 'unknown';

    ApprovalLog::create([
      'response_id' => $response->id,
      'role' => $currentRole,
      'action' => 'rejected',
      'comment' => $request->comment
    ]);

    $response->status = 'rejected';
    $response->save();

    return response()->json(['message' => 'Submission rejected successfully', 'status' => 'rejected']);
  }

  public function index(Request $request)
  {
    $role = $request->query('role');

    $responses = \App\Models\Response::with('form')->get();

    $filtered = $responses->filter(function ($res) use ($role) {
      $workflow = $res->form->workflow;

      if (is_string($workflow)) {
        $workflow = json_decode($workflow, true);
      }

      if (!$workflow) return false;

      return isset($workflow[$res->current_step]) &&
        $workflow[$res->current_step] === $role;
    });

    return response()->json(array_values($filtered->toArray()));
  }

  public function forward($id)
  {
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    $workflow = $form->workflow;

    if (is_string($workflow)) {
      $workflow = json_decode($workflow, true);
    }

    if ($response->current_step < count($workflow) - 1) {
      $response->current_step += 1;
      $response->save();

      return response()->json([
        'message' => 'Submission forwarded successfully',
        'current_step' => $response->current_step
      ]);
    }
    return response()->json(['message' => 'Submission is already at the final step'], 400);
  }
}
