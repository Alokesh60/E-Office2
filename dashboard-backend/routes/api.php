<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\DownloadController;

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

require __DIR__ . '/auth.php';