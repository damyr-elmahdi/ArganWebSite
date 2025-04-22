<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Event;
use Illuminate\Http\Request;

class EventCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Get comments for a specific event.
     */
    public function index(Event $event)
    {
        $comments = $event->comments()
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = new Comment($validated);
        $comment->event_id = $event->id;
        $comment->user_id = $request->user()->id;
        $comment->save();

        // Load the user relationship for the response
        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }

    /**
     * Update an existing comment.
     */
    public function update(Request $request, Event $event, Comment $comment)
    {
        // Check if the comment belongs to this event
        if ($comment->event_id !== $event->id) {
            return response()->json(['error' => 'Comment does not belong to this event'], 404);
        }

        // Ensure the user owns this comment
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update($validated);

        return response()->json($comment);
    }

    /**
     * Delete a comment.
     */
    public function destroy(Request $request, Event $event, Comment $comment)
    {
        // Check if the comment belongs to this event
        if ($comment->event_id !== $event->id) {
            return response()->json(['error' => 'Comment does not belong to this event'], 404);
        }
    
        // Ensure the user owns this comment or is an admin
        if ($comment->user_id !== $request->user()->id && !$request->user()->hasRole('administrator')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $comment->delete();
    
        return response()->json(null, 204);
    }
}