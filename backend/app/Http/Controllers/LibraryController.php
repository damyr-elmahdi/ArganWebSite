<?php

namespace App\Http\Controllers;

use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LibraryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
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
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('inventory_number', 'like', "%{$search}%");
            });
        }

        $libraryItems = $query->paginate(15);

        // Add availability information
        foreach ($libraryItems as $item) {
            $item->available_quantity = $item->availableQuantity();
            $item->is_available = $item->isAvailableForBorrowing();
        }

        return response()->json($libraryItems);
    }

    public function show(LibraryItem $libraryItem)
    {
        $libraryItem->available_quantity = $libraryItem->availableQuantity();
        $libraryItem->is_available = $libraryItem->isAvailableForBorrowing();
        
        return response()->json($libraryItem);
    }

    public function store(Request $request)
    {
        $this->authorize('create', LibraryItem::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'inventory_number' => 'required|string|max:255|unique:library_items',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
            'available' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('library_items', 'public');
            $validated['image_path'] = $path;
        }

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
            'quantity' => 'integer|min:1',
            'inventory_number' => 'string|max:255|unique:library_items,inventory_number,' . $libraryItem->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
            'available' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($libraryItem->image_path) {
                Storage::disk('public')->delete($libraryItem->image_path);
            }
            
            $path = $request->file('image')->store('library_items', 'public');
            $validated['image_path'] = $path;
        }

        $libraryItem->update($validated);

        return response()->json($libraryItem);
    }

    public function destroy(LibraryItem $libraryItem)
    {
        $this->authorize('delete', $libraryItem);

        // Check if there are active borrowings
        if ($libraryItem->activeBorrowings()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete item with active borrowings'
            ], 400);
        }

        // Delete image if exists
        if ($libraryItem->image_path) {
            Storage::disk('public')->delete($libraryItem->image_path);
        }

        $libraryItem->delete();

        return response()->json(null, 204);
    }
    
    // Get categories for filtering
    public function categories()
    {
        $categories = LibraryItem::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');
            
        return response()->json($categories);
    }
}