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
        
        return response()->json($news);
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', News::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean',
        ]);
        
        $news = new News($validated);
        $news->author_id = $request->user()->id;
        
        if ($validated['is_published'] ?? false) {
            $news->published_at = now();
        }
        
        $news->save();
        
        return response()->json($news, 201);
    }
    
    public function update(Request $request, News $news)
    {
        $this->authorize('update', $news);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'is_published' => 'boolean',
        ]);
        
        // Handle publication status change
        if (isset($validated['is_published']) && !$news->is_published && $validated['is_published']) {
            $news->published_at = now();
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