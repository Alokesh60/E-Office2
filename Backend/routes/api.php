<?php
// api.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\ResponseController;

use App\Models\Response;

Route::middleware('auth:sanctum')->get('/submissions', function (Request $request) {

    $designation = $request->user()->designation;

    return Response::with(['form', 'answers.field'])
        ->get()
        ->filter(function ($submission) use ($designation) {

            $workflow = $submission->form->workflow;

            if (!$workflow) {
                return false;
            }

            $currentStep = $submission->current_step;

            $currentRole = $workflow[$currentStep] ?? null;

            return $currentRole === $designation
                && $submission->status === 'pending';
        })
        ->values();
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/submission/action', [ResponseController::class, 'takeAction']);

    Route::get('/submission/{id}', function ($id) {
        return \App\Models\Response::with(['form', 'answers.field', 'logs'])->findOrFail($id);
    });

    Route::get('/student/submissions', function (Request $request) {

        return \App\Models\Response::with('form')
            ->where('user_id', $request->user()->id)
            ->get();
    });

    Route::post('/submission/{id}/send-back', [SubmissionController::class, 'sendBack']);

    Route::post('/submission/{id}/approve', [SubmissionController::class, 'approve']);

    Route::post('/submission/{id}/reject', [SubmissionController::class, 'reject']);

    Route::post('/submission/{id}/forward', [SubmissionController::class, 'forward']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::delete('/forms/{id}/fields', [FormController::class, 'deleteFields']);

    Route::put('/forms/{id}', [FormController::class, 'update']);

    Route::delete('/forms/{id}', [FormController::class, 'destroy']);

    Route::post('/forms', [FormController::class, 'store']);

    Route::post('/form-fields', function (Request $request) {
        return \App\Models\FormField::create($request->all());
    });

    // Announcement Management
    Route::get('/admin/announcements', function () {
        return \App\Models\Announcement::latest()->get();
    });

    Route::post('/announcements', function (Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);
        $validated['created_by'] = $request->user()->id;
        return \App\Models\Announcement::create($validated);
    });

    Route::put('/announcements/{id}', function (Request $request, $id) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);
        $announcement = \App\Models\Announcement::findOrFail($id);
        $announcement->update($validated);
        return $announcement;
    });

    Route::delete('/announcements/{id}', function ($id) {
        $announcement = \App\Models\Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    });

    // Calendar Event / Holiday Management
    Route::post('/calendar-events', function (Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:holiday,deadline,event',
            'date' => 'required|date_format:Y-m-d',
        ]);
        $validated['user_id'] = null; // Global event
        return \App\Models\CalendarEvent::create($validated);
    });

    Route::delete('/calendar-events/{id}', function ($id) {
        $event = \App\Models\CalendarEvent::findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    });
});

Route::get('/forms', function () {
    return \App\Models\Form::with('fields')->get();
});

Route::get('/form/{id}', [FormController::class, 'show']);

Route::middleware(['auth:sanctum'])->post('/form/{id}/submit', [FormController::class, 'submit']);

Route::middleware(['auth:sanctum'])->get('/form/{id}/responses', [FormController::class, 'responses']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);


Route::middleware('auth:sanctum')->prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/activity', [DashboardController::class, 'activity']);
    Route::get('/announcements', [DashboardController::class, 'announcements']);
    Route::get('/calendar', [DashboardController::class, 'calendar']);
});

Route::middleware('auth:sanctum')->get('/me', [UserController::class, 'me']);

Route::middleware('auth:sanctum')->get('/applications/search', [ApplicationController::class, 'search']);

Route::middleware('auth:sanctum')->get('/download/application/{id}', [DownloadController::class, 'application']);

Route::post('/custom-register', [AuthController::class, 'register']);

Route::post('/login-custom', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // ── SETTINGS ──────────────────────────────────────────────────────────
    Route::prefix('settings')->group(function () {

        // Profile
        Route::get('/profile', [SettingsController::class, 'getProfile']);
        Route::put('/profile', [SettingsController::class, 'updateProfile']);
        Route::post('/avatar', [SettingsController::class, 'uploadAvatar']);
        Route::delete('/avatar', [SettingsController::class, 'removeAvatar']);
        Route::put('/password', [SettingsController::class, 'updatePassword']);

        // Notifications
        Route::get('/notifications', [SettingsController::class, 'getNotifications']);
        Route::put('/notifications', [SettingsController::class, 'updateNotifications']);
        Route::post('/notifications/reset', [SettingsController::class, 'resetNotifications']);

        // Connected devices
        Route::get('/devices', [SettingsController::class, 'getDevices']);
        Route::delete('/devices', [SettingsController::class, 'logoutAllOtherDevices']);
        Route::delete('/devices/{tokenId}', [SettingsController::class, 'logoutDevice']);
    });

    // ── FILES & FOLDERS ───────────────────────────────────────────────────
    Route::get('/folders', [FileController::class, 'getFolders']);
    Route::post('/folder/create', [FileController::class, 'createFolder']);
    Route::put('/folder/{id}', [FileController::class, 'renameFolder']);
    Route::delete('/folder/{id}', [FileController::class, 'deleteFolder']);

    Route::get('/files/search', [FileController::class, 'searchFiles']);
    Route::get('/files/{folderId}', [FileController::class, 'getFiles']);

    Route::post('/file/upload', [FileController::class, 'uploadFile']);
    Route::put('/file/{id}', [FileController::class, 'renameFile']);
    Route::delete('/file/{id}', [FileController::class, 'deleteFile']);
    Route::get('/file/download/{id}', [FileController::class, 'downloadFile']);

    Route::get('/storage-info', [FileController::class, 'storageInfo']);
});

require __DIR__ . '/auth.php';
