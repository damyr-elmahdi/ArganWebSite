<?php

namespace App\Http\Controllers;

use App\Models\LibraryItem;
use App\Models\BookBorrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class LibraryController extends Controller
{
    // Rest of your controller remains the same
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

        // Apply sorting if provided
        $sortField = $request->get('sort_by', 'inventory_number');
        $sortDirection = $request->get('sort_dir', 'asc');

        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['inventory_number', 'title', 'author', 'category', 'created_at'];
        $sortField = in_array($sortField, $allowedSortFields) ? $sortField : 'inventory_number';

        // Validate sort direction
        $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'asc';

        $query->orderBy($sortField, $sortDirection);

        // Get per_page from request or default to 12
        $perPage = $request->get('per_page', 12);
        // Ensure per_page is a reasonable value between 5 and 50
        $perPage = min(max(intval($perPage), 5), 50);

        $libraryItems = $query->paginate($perPage);

        // Removed availability information as it depends on borrowing functionality

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

        \Log::info('Update request received', [
            'book_id' => $libraryItem->id,
            'has_file' => $request->hasFile('image'),
        ]);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'category' => 'string|max:255',
            'quantity' => 'integer|min:1',
            'inventory_number' => 'string|max:255|unique:library_items,inventory_number,' . $libraryItem->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'available' => 'boolean',
            'due_date' => 'nullable|date',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            \Log::info('Processing image upload');
            // Delete old image if exists
            if ($libraryItem->image_path) {
                Storage::disk('public')->delete($libraryItem->image_path);
            }

            $path = $request->file('image')->store('library_items', 'public');
            $validated['image_path'] = $path;
            \Log::info('Image saved to path', ['path' => $path]);
        }

        $libraryItem->update($validated);
        \Log::info('Book updated successfully', ['book' => $libraryItem]);

        return response()->json($libraryItem);
    }

    public function destroy(LibraryItem $libraryItem)
    {
        $this->authorize('delete', $libraryItem);

        // Removed check for active borrowings

        // Delete image if exists
        if ($libraryItem->image_path) {
            Storage::disk('public')->delete($libraryItem->image_path);
        }

        $libraryItem->delete();

        return response()->json(null, 204);
    }

    // In backend/app/Http/Controllers/LibraryController.php
    public function categories()
    {
        // Get unique categories from the database
        $categories = LibraryItem::distinct('category')->pluck('category')->sort()->values();
        return response()->json($categories);
    }



    public function bookStats()
    {
        // Count requested books (those that have been borrowed but not returned)
        $requested = BookBorrowing::where('status', 'borrowed')->count();

        // Count returned books
        $returned = BookBorrowing::where('status', 'returned')->count();

        return response()->json([
            'requested' => $requested,
            'returned' => $returned
        ]);
    }

    public function markBookReturned(Request $request, LibraryItem $libraryItem)
    {
        $this->authorize('update', $libraryItem);

        $request->validate([
            'student_id' => 'required|exists:users,id'
        ]);

        // Begin transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Find the borrow record
            $borrowRecord = BookBorrowing::where('library_item_id', $libraryItem->id)
                ->where('student_id', $request->student_id)
                ->where('status', 'borrowed')
                ->firstOrFail();

            // Update borrow record status to returned
            $borrowRecord->status = 'returned';
            $borrowRecord->return_date = now();
            $borrowRecord->save();

            // Increment the available quantity
            $libraryItem->quantity += 1;
            $libraryItem->save();

            DB::commit();

            return response()->json([
                'message' => 'Book marked as returned successfully',
                'library_item' => $libraryItem
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to mark book as returned',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}