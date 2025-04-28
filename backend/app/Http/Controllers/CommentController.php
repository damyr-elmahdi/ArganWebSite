<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get comments for a specific news article.
     */
    public function index(News $news)
    {
        // Add the replies relationship to the eager loading

        $comments = $news->comments()
            ->with(['user:id,name', 'replies.user:id,name'])
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, News $news)
    {
        // In store method of both controllers
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);
    
        $comment = new Comment($validated);
        $comment->news_id = $news->id;
        $comment->user_id = $request->user()->id;
        $comment->save();
    
        // Load the user relationship for the response
        $comment->load('user:id,name');
    
        return response()->json($comment, 201);
    }

    /**
     * Update an existing comment.
     */
    public function update(Request $request, News $news, Comment $comment)
    {
        // Check if the comment belongs to this news article
        if ($comment->news_id !== $news->id) {
            return response()->json(['error' => 'Comment does not belong to this news article'], 404);
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
    public function destroy(Request $request, News $news, Comment $comment)
    {
        // Check if the comment belongs to this news article
        if ($comment->news_id !== $news->id) {
            return response()->json(['error' => 'Comment does not belong to this news article'], 404);
        }

        // Ensure the user owns this comment or is an admin
        if ($comment->user_id !== $request->user()->id && !$request->user()->hasRole('administrator')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}
