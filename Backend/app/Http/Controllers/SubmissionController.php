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
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow)
      ? json_decode($form->workflow, true)
      : $form->workflow;

    $currentRole = $workflow[$response->current_step] ?? null;

    if (!$request->user()) {
      return response()->json(['message' => 'Unauthenticated'], 401);
    }

    if ($request->user()->designation !== $currentRole) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    if ($response->status === 'approved') {
      return response()->json(['message' => 'Already approved'], 400);
    }

    if ($response->status === 'rejected') {
      return response()->json(['message' => 'Already rejected'], 400);
    }

    if ($response->current_step > 0) {

      $response->current_step -= 1;
      $response->status = 'pending';
      $response->save();

      ApprovalLog::create([
        'response_id' => $response->id,
        'role' => $currentRole,
        'action' => 'sent_back',
        'comments' => $request->comment
      ]);

      return response()->json([
        'message' => 'Submission sent back successfully',
        'current_step' => $response->current_step
      ]);
    }

    return response()->json([
      'message' => 'Submission is already at the first step'
    ], 400);
  }

  public function approve(Request $request, $id)
  {
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow)
      ? json_decode($form->workflow, true)
      : $form->workflow;

    $currentRole = $workflow[$response->current_step] ?? null;

    if (!$request->user()) {
      return response()->json(['message' => 'Unauthenticated'], 401);
    }

    if ($request->user()->designation !== $currentRole) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    if ($response->status === 'approved') {
      return response()->json(['message' => 'Submission already approved'], 400);
    }

    if ($response->status === 'rejected') {
      return response()->json(['message' => 'Submission already rejected'], 400);
    }

    ApprovalLog::create([
      'response_id' => $response->id,
      'role' => $currentRole,
      'action' => 'approved',
      'comments' => $request->comment
    ]);

    if ($response->current_step === count($workflow) - 1) {

      $response->status = 'approved';
      $response->save();

      return response()->json([
        'message' => 'Submission approved successfully',
        'status' => 'approved'
      ]);
    }

    $response->current_step += 1;
    $response->save();

    return response()->json([
      'message' => 'Submission approved and forwarded',
      'current_step' => $response->current_step
    ]);
  }

  public function reject(Request $request, $id)
  {
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow)
      ? json_decode($form->workflow, true)
      : $form->workflow;

    $currentRole = $workflow[$response->current_step] ?? null;

    if (!$request->user()) {
      return response()->json(['message' => 'Unauthenticated'], 401);
    }

    if ($request->user()->designation !== $currentRole) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    ApprovalLog::create([
      'response_id' => $response->id,
      'role' => $currentRole,
      'action' => 'rejected',
      'comments' => $request->comment
    ]);

    $response->status = 'rejected';
    $response->save();

    return response()->json([
      'message' => 'Submission rejected successfully',
      'status' => 'rejected'
    ]);
  }

  public function forward(Request $request, $id)
  {
    $response = Response::findOrFail($id);
    $form = Form::findOrFail($response->form_id);

    $workflow = is_string($form->workflow)
      ? json_decode($form->workflow, true)
      : $form->workflow;

    $currentRole = $workflow[$response->current_step] ?? null;

    if (!$request->user()) {
      return response()->json(['message' => 'Unauthenticated'], 401);
    }

    if ($request->user()->designation !== $currentRole) {
      return response()->json(['message' => 'Unauthorized'], 403);
    }

    if ($response->current_step < count($workflow) - 1) {

      ApprovalLog::create([
        'response_id' => $response->id,
        'role' => $currentRole,
        'action' => 'forwarded'
      ]);

      $response->current_step += 1;
      $response->save();

      return response()->json([
        'message' => 'Submission forwarded successfully',
        'current_step' => $response->current_step
      ]);
    }

    return response()->json([
      'message' => 'Submission is already at the final step'
    ], 400);
  }
}
