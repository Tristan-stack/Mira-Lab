<?php
namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index($projectId)
    {
        $chat = Chat::where('project_id', $projectId)->firstOrFail();
        $messages = $chat->messages()->with('user')->get();

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request, $projectId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $chat = Chat::where('project_id', $projectId)->firstOrFail();

        $message = $chat->messages()->create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return response()->json(['message' => $message]);
    }
}