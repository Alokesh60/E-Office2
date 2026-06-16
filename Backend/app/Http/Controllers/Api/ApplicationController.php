<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;

class ApplicationController extends Controller
{
    public function search(Request $request)
    {
        $q = $request->query('q');

        return response()->json(
            Application::where('user_id', $request->user()->id)
                ->where(function ($query) use ($q) {
                    $query->where('type', 'like', "%$q%")
                          ->orWhere('id', $q);
                })
                ->latest()
                ->paginate(10)
        );
    }
}