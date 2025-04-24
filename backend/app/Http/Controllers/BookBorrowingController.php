<?php

namespace App\Http\Controllers;

use App\Models\BookBorrowingRequest;
use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BookBorrowingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    
    // Student creates a borrowing request
    public function requestBook(Request $request)
    {
        $request->validate([
            'library_item_id' => 'required|exists:library_items,id',
        ]);
        
        $libraryItem = LibraryItem::findOrFail($request->library_item_id);
        
        // Check if book is available
        if (!$libraryItem->isAvailableForBorrowing()) {
            return response()->json([
                'message' => 'This book is currently not available for borrowing'
            ], 400);
        }
        
        // Check if student already has a pending or active request for this book
        $existingRequest = BookBorrowingRequest::where('student_id', Auth::id())
            ->where('library_item_id', $libraryItem->id)
            ->whereIn('status', ['pending', 'approved'])
            ->whereNull('return_date')
            ->first();
            
        if ($existingRequest) {
            return response()->json([
                'message' => 'You already have a pending or active request for this book'
            ], 400);
        }
        
        // Create borrowing request
        $borrowRequest = BookBorrowingRequest::create([
            'student_id' => Auth::id(),
            'library_item_id' => $libraryItem->id,
            'status' => 'pending'
        ]);
        
        return response()->json([
            'message' => 'Book request submitted successfully',
            'request' => $borrowRequest
        ], 201);
    }
    
    // Student views their borrowing requests
    public function myRequests()
    {
        try {
            $requests = BookBorrowingRequest::with('libraryItem')
                ->where('student_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($requests);
        } catch (\Exception $e) {
            \Log::error('Error in myRequests: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while fetching your requests'], 500);
        }
    }
    
    // Librarian views all borrowing requests
    public function index(Request $request)
    {
        $this->authorize('viewAny', BookBorrowingRequest::class);
        
        $query = BookBorrowingRequest::with(['student', 'libraryItem']);
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $requests = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json($requests);
    }
    
    // Librarian approves a request
    public function approve(BookBorrowingRequest $request)
    {
        $this->authorize('approve', $request);
        
        // Check if book is still available
        $libraryItem = $request->libraryItem;
        if (!$libraryItem->isAvailableForBorrowing()) {
            return response()->json([
                'message' => 'This book is no longer available for borrowing'
            ], 400);
        }
        
        // Set standard loan period (e.g., 14 days)
        $borrowDate = Carbon::now();
        $dueDate = $borrowDate->copy()->addDays(14);
        
        $request->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'borrow_date' => $borrowDate,
            'due_date' => $dueDate
        ]);
        
        return response()->json([
            'message' => 'Request approved successfully',
            'request' => $request->fresh()
        ]);
    }
    
    // Librarian rejects a request
    public function reject(Request $httpRequest, BookBorrowingRequest $request)
    {
        $this->authorize('reject', $request);
        
        $httpRequest->validate([
            'notes' => 'nullable|string'
        ]);
        
        $request->update([
            'status' => 'rejected',
            'notes' => $httpRequest->notes
        ]);
        
        return response()->json([
            'message' => 'Request rejected',
            'request' => $request->fresh()
        ]);
    }
    
    // Librarian marks a book as returned
    public function markReturned(BookBorrowingRequest $request)
    {
        $this->authorize('markReturned', $request);
        
        if ($request->status !== 'approved' || $request->return_date !== null) {
            return response()->json([
                'message' => 'This request cannot be marked as returned'
            ], 400);
        }
        
        $request->update([
            'status' => 'returned',
            'return_date' => Carbon::now()
        ]);
        
        return response()->json([
            'message' => 'Book marked as returned successfully',
            'request' => $request->fresh()
        ]);
    }
}