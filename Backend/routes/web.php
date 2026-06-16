<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
Route::get('/form/{id}', [FormController::class, 'show']);
Route::get('/form/{id}/responses', [FormController::class, 'responses']);

require __DIR__ . '/auth.php';
