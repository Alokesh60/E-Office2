<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ProfileCompletionService;

class UserController extends Controller
{
    public function me(Request $request, ProfileCompletionService $svc)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'profile_completion' => $svc->calculate($user)
        ]);
    }
}