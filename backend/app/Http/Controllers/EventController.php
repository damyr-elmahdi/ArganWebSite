<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }
    
    public function index(Request $request)
    {
        $query = Event::query();
        
        // Filter events by date range if provided
        if ($request->has('start_date')) {
            $query->whereDate('start_time', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('end_time', '<=', $request->end_date);
        }
        
        $events = $query->orderBy('start_time')->paginate(15);
        
        return response()->json($events);
    }
    
    public function show(Event $event)
    {
        return response()->json($event);
    }
    
    public function store(Request $request)
    {
        $this->authorize('create', Event::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
        ]);
        
        $event = Event::create($validated);
        
        return response()->json($event, 201);
    }
    
    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'date',
            'end_time' => 'date|after:start_time',
            'location' => 'nullable|string|max:255',
        ]);
        
        $event->update($validated);
        
        return response()->json($event);
    }
    
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        
        $event->delete();
        
        return response()->json(null, 204);
    }
}
