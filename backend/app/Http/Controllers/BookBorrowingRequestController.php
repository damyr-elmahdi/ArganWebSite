<?php

namespace App\Http\Controllers;

use App\Models\BookBorrowingRequest;
use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BookBorrowingRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of the borrowing requests based on role and filters.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = BookBorrowingRequest::with(['libraryItem', 'student']);

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            switch ($request->status) {
                case 'pending':
                    $query->pending();
                    break;
                case 'approved':
                    $query->approved();
                    break;
                case 'returned':
                    $query->where('status', 'approved')->whereNotNull('return_date');
                    break;
                case 'rejected':
                    $query->rejected();
                    break;
            }
        }

        // If user is student, only show their requests
        if ($user->isStudent()) {
            $query->where('user_id', $user->id);
        }
        
        // If librarian or admin, show all requests (with applied filters)
        
        $borrowRequests = $query->latest()->paginate(15);
        
        return response()->json($borrowRequests);
    }

    /**
     * Store a newly created borrowing request.
     */
    public function store(Request $request)
    {
        $this->authorize('create', BookBorrowingRequest::class);
        
        $validated = $request->validate([
            'library_item_id' => 'required|exists:library_items,id',
        ]);
        
        // Check if book is available
        $libraryItem = LibraryItem::findOrFail($validated['library_item_id']);
        if (!$libraryItem->isAvailableForBorrowing()) {
            return response()->json([
                'message' => 'This book is not available for borrowing at the moment.'
            ], 400);
        }
        
        // Check if user already has a pending or approved request for this book
        $existingRequest = BookBorrowingRequest::where('user_id', $request->user()->id)
            ->where('library_item_id', $validated['library_item_id'])
            ->where(function($query) {
                $query->where('status', 'pending')
                      ->orWhere(function($q) {
                          $q->where('status', 'approved')
                            ->whereNull('return_date');
                      });
            })
            ->first();
            
        if ($existingRequest) {
            return response()->json([
                'message' => 'You already have a pending or active request for this book.'
            ], 400);
        }
        
        $borrowRequest = new BookBorrowingRequest();
        $borrowRequest->user_id = $request->user()->id;
        $borrowRequest->library_item_id = $validated['library_item_id'];
        $borrowRequest->status = 'pending';
        $borrowRequest->save();
        
        return response()->json($borrowRequest, 201);
    }

    /**
     * Display the student's borrowing requests.
     */
    public function myRequests(Request $request)
    {
        $requests = BookBorrowingRequest::with('libraryItem')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
            
        return response()->json($requests);
    }

    /**
     * Approve a borrowing request.
     */
    public function approve(Request $request, BookBorrowingRequest $borrowingRequest)
    {
        $this->authorize('approve', $borrowingRequest);
        
        // Check if book is still available
        $libraryItem = $borrowingRequest->libraryItem;
        if (!$libraryItem->isAvailableForBorrowing()) {
            return response()->json([
                'message' => 'This book is no longer available for borrowing.'
            ], 400);
        }
        
        // Set due date (e.g., 14 days from now)
        $dueDate = Carbon::now()->addDays(14);
        
        $borrowingRequest->status = 'approved';
        $borrowingRequest->due_date = $dueDate;
        $borrowingRequest->save();
        
        return response()->json($borrowingRequest);
    }

    /**
     * Reject a borrowing request.
     */
    public function reject(Request $request, BookBorrowingRequest $borrowingRequest)
    {
        $this->authorize('reject', $borrowingRequest);
        
        $validated = $request->validate([
            'notes' => 'nullable|string|max:255',
        ]);
        
        $borrowingRequest->status = 'rejected';
        if (isset($validated['notes'])) {
            $borrowingRequest->notes = $validated['notes'];
        }
        $borrowingRequest->save();
        
        return response()->json($borrowingRequest);
    }

    /**
     * Mark a book as returned.
     */
    public function return(Request $request, BookBorrowingRequest $borrowingRequest)
    {
        $this->authorize('return', $borrowingRequest);
        
        $borrowingRequest->return_date = Carbon::now();
        $borrowingRequest->save();
        
        return response()->json($borrowingRequest);
    }

    /**
     * Get borrowing statistics for librarian dashboard.
     */
    public function borrowingStats(Request $request)
    {
        $this->authorize('viewAny', BookBorrowingRequest::class);
        
        // Ensure user is librarian or administrator
        $user = $request->user();
        if (!$user->isLibrarian() && !$user->isAdministrator()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $stats = [
            'pending' => BookBorrowingRequest::pending()->count(),
            'approved' => BookBorrowingRequest::approved()->count(),
            'returned' => BookBorrowingRequest::where('status', 'approved')->whereNotNull('return_date')->count(),
            'rejected' => BookBorrowingRequest::rejected()->count(),
        ];
        
        return response()->json($stats);
    }
}