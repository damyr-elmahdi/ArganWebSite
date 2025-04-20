<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function index()
    {
        $news = News::where('is_published', true)
            ->with('author:id,name')
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return response()->json($news);
    }

    public function show(News $news)
    {
        if (!$news->is_published) {
            $this->authorize('view', $news);
        }

        $news->load('author:id,name');

        // Add full image URL
        if ($news->image_path) {
            $news->image_url = url('storage/' . $news->image_path);
        }

        // Load top 5 comments by default
        $news->load(['comments' => function ($query) {
            $query->with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->limit(5);
        }]);

        // Add comment count
        $news->comments_count = $news->comments()->count();

        return response()->json($news);
    }

    public function store(Request $request)
    {
        $this->authorize('create', News::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
            'scheduled_for' => 'nullable|date|after:now', // Add validation for scheduled date
            'image' => 'nullable|image|max:2048', // Allow image upload up to 2MB
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
            $validated['image_path'] = $imagePath;
        }

        $news = new News($validated);
        $news->author_id = $request->user()->id;

        // Handle publication status
        if ($validated['is_published'] ?? false) {
            $news->is_published = true;
            $news->published_at = now();
        }
        // Handle scheduled publication
        elseif (isset($validated['scheduled_for'])) {
            $news->scheduled_publication = $validated['scheduled_for'];
        }

        $news->save();

        return response()->json($news, 201);
    }

    // Add this to the update method as well
    public function update(Request $request, News $news)
    {
        $this->authorize('update', $news);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'is_published' => 'boolean',
            'scheduled_for' => 'nullable|date|after:now', // Add validation for scheduled date
            'image' => 'nullable|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
            $validated['image_path'] = $imagePath;
        }

        // Handle publication status change
        if (isset($validated['is_published'])) {
            if (!$news->is_published && $validated['is_published']) {
                $news->published_at = now();
                $news->scheduled_publication = null; // Clear any scheduled publication time
            }
        }

        // Handle scheduled publication
        if (isset($validated['scheduled_for']) && !($validated['is_published'] ?? $news->is_published)) {
            $news->scheduled_publication = $validated['scheduled_for'];
        }

        $news->update($validated);

        return response()->json($news);
    }

    public function destroy(News $news)
    {
        $this->authorize('delete', $news);

        $news->delete();

        return response()->json(null, 204);
    }

    public function publish(News $news)
    {
        $this->authorize('publish', $news);

        $news->publish();

        return response()->json($news);
    }

    public function archive(News $news)
    {
        $this->authorize('archive', $news);

        $news->archive();

        return response()->json($news);
    }
}
