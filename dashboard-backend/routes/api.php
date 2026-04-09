<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\AuthController;

Route::delete('/forms/{id}/fields', [FormController::class, 'deleteFields']);

Route::put('/forms/{id}', [FormController::class, 'update']);

Route::delete('/forms/{id}', [FormController::class, 'destroy']);

Route::get('/forms', function () {
    return \App\Models\Form::with('fields')->get();
});

Route::post('/forms', function (Request $request) {
    return \App\Models\Form::create($request->all());
});

Route::post('/form-fields', function (Request $request) {
    return \App\Models\FormField::create($request->all());
});

// Get form (for filling)
Route::get('/form/{id}', [FormController::class, 'show']);

// Submit form
Route::post('/form/{id}/submit', [FormController::class, 'submit']);

// Get responses (admin)
Route::get('/form/{id}/responses', [FormController::class, 'responses']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/announcements', function () {
        return 'Admin only';
    });
});

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

require __DIR__ . '/auth.php';
