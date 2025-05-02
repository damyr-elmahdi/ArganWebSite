<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resources.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Fetch all resources with basic information
        $resources = Resource::select(
            'id',
            'title',
            'subject',
            'year_level as yearLevel',
            'specialization',
            'file_path',
            'file_name',
            'uploaded_by',
            'created_at'
        )->get();

        // Add file URL to each resource
        $resources->each(function ($resource) {
            $resource->fileUrl = route('resources.download', $resource->id);
            $resource->viewUrl = route('resources.view', $resource->id);
        });

        return response()->json($resources);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function upload(Request $request)
    {
        // Check if user is authorized (teacher or admin)
        if (!Auth::user()->hasRole(['teacher', 'administrator'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:100',
            'yearLevel' => 'required|string|max:50',
            'specialization' => 'required|string|max:50',
            'file' => 'required|file|mimes:pdf|max:10240', // 10MB max size
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            // Check if the storage directory exists and is writable
            $storageDir = 'resources';
            $privateStoragePath = storage_path('app/private/' . $storageDir);
            
            if (!file_exists($privateStoragePath)) {
                if (!mkdir($privateStoragePath, 0775, true)) {
                    throw new \Exception('Failed to create storage directory: ' . $privateStoragePath);
                }
            }
            
            if (!is_writable($privateStoragePath)) {
                throw new \Exception('Storage directory is not writable: ' . $privateStoragePath);
            }
            
            // Upload file to storage
            $file = $request->file('file');
            $originalFilename = $file->getClientOriginalName();
            
            // Generate a unique filename with the original extension
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            // Store the file in a private directory
            $path = $file->storeAs($storageDir, $filename, 'private');
            
            if (!$path) {
                throw new \Exception('Failed to store file in private storage');
            }
            
            // Create resource record in the database
            $resource = Resource::create([
                'title' => $request->input('title'),
                'subject' => $request->input('subject'),
                'year_level' => $request->input('yearLevel'),
                'specialization' => $request->input('specialization'),
                'file_name' => $originalFilename,
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'uploaded_by' => Auth::id(),
            ]);
    
            // Return success response with resource ID
            return response()->json([
                'message' => 'Resource uploaded successfully',
                'resource' => [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'subject' => $resource->subject,
                    'yearLevel' => $resource->year_level,
                    'specialization' => $resource->specialization,
                    'fileUrl' => route('resources.download', $resource->id),
                    'viewUrl' => route('resources.view', $resource->id),
                ],
            ], 201);
    
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Resource upload failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to upload resource',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $resource = Resource::findOrFail($id);
        
        $resource->fileUrl = route('resources.download', $resource->id);
        $resource->viewUrl = route('resources.view', $resource->id);
        
        return response()->json($resource);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Check if user is authorized (teacher or admin)
        if (!Auth::user()->hasRole(['teacher', 'administrator'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $resource = Resource::findOrFail($id);

        // Check if the user is the owner or an admin
        if (Auth::user()->hasRole('administrator') || $resource->uploaded_by == Auth::id()) {
            // Delete the file from storage
            if (Storage::disk('private')->exists($resource->file_path)) {
                Storage::disk('private')->delete($resource->file_path);
            }
            
            // Delete the database record
            $resource->delete();
            
            return response()->json(['message' => 'Resource deleted successfully']);
        }
        
        return response()->json(['message' => 'You do not have permission to delete this resource'], 403);
    }

    /**
     * Download the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function download($id)
    {
        $resource = Resource::findOrFail($id);
        
        // Check if file exists
        if (!Storage::disk('private')->exists($resource->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        // Return file for download with original filename
        return Storage::disk('private')->download(
            $resource->file_path, 
            $resource->file_name, 
            ['Content-Type' => $resource->mime_type]
        );
    }

    /**
     * View the specified resource in browser.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function view($id)
    {
        $resource = Resource::findOrFail($id);
        
        // Check if file exists
        if (!Storage::disk('private')->exists($resource->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        // Get file content
        $fileContents = Storage::disk('private')->get($resource->file_path);
        
        // Return file with appropriate headers for in-browser display
        return Response::make($fileContents, 200, [
            'Content-Type' => $resource->mime_type,
            'Content-Disposition' => 'inline; filename="' . $resource->file_name . '"',
        ]);
    }
}