<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    
    public function index(Request $request)
    {
        $query = Resource::query();
        
        // Filter by subject if provided
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        
        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $resources = $query->with(['subject:id,name', 'uploader:id,name'])
            ->paginate(15);
            
        return response()->json($resources);
    }
    
    public function show(Resource $resource)
    {
        $this->authorize('view', $resource);
        
        $resource->load(['subject:id,name', 'uploader:id,name']);
        
        return response()->json($resource);
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', Resource::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|max:50',
            'subject_id' => 'required|exists:subjects,id',
            'file' => 'required|file|max:10240', // 10MB max file size
        ]);
        
        // Store the file
        $path = $request->file('file')->store('resources', 'public');
        
        $resource = new Resource([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_url' => $path,
            'type' => $validated['type'],
            'subject_id' => $validated['subject_id'],
            'uploaded_by' => $request->user()->id,
        ]);
        
        $resource->save();
        
        return response()->json($resource, 201);
    }
    
    public function update(Request $request, Resource $resource)
    {
        $this->authorize('update', $resource);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'type' => 'string|max:50',
            'subject_id' => 'exists:subjects,id',
            'file' => 'nullable|file|max:10240', // 10MB max file size
        ]);
        
        // Update file if provided
        if ($request->hasFile('file')) {
            // Delete old file
            if ($resource->file_url) {
                Storage::disk('public')->delete($resource->file_url);
            }
            
            // Store new file
            $path = $request->file('file')->store('resources', 'public');
            $validated['file_url'] = $path;
        }
        
        $resource->update($validated);
        
        return response()->json($resource);
    }
    
    public function destroy(Resource $resource)
    {
        $this->authorize('delete', $resource);
        
        // Delete the file
        if ($resource->file_url) {
            Storage::disk('public')->delete($resource->file_url);
        }
        
        $resource->delete();
        
        return response()->json(null, 204);
    }
    
    public function download(Resource $resource)
    {
        $this->authorize('view', $resource);
        
        if (!Storage::disk('public')->exists($resource->file_url)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        return Storage::disk('public')->download($resource->file_url, $resource->title);
    }
}
