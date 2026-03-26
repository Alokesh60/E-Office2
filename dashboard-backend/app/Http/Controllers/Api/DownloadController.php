<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Application;

class DownloadController extends Controller
{
    public function application(Request $request, $id)
    {
        $app = Application::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return Storage::download($app->file_path);
    }
}