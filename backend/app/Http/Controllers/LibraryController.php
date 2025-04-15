<?php

namespace App\Http\Controllers;

use App\Models\LibraryItem;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $query = LibraryItem::query();

        // Apply filters if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        $libraryItems = $query->paginate(15);

        return response()->json($libraryItems);
    }

    public function show(LibraryItem $libraryItem)
    {
        return response()->json($libraryItem);
    }

    public function store(Request $request)
    {
        $this->authorize('create', LibraryItem::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'available' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $libraryItem = LibraryItem::create($validated);

        return response()->json($libraryItem, 201);
    }

    public function update(Request $request, LibraryItem $libraryItem)
    {
        $this->authorize('update', $libraryItem);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'category' => 'string|max:255',
            'available' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        $libraryItem->update($validated);

        return response()->json($libraryItem);
    }
    public function destroy(LibraryItem $libraryItem)
    {
        $this->authorize('delete', $libraryItem);

        $libraryItem->delete();

        return response()->json(null, 204);
    }
}
