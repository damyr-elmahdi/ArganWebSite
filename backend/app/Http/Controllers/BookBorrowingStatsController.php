<?php

namespace App\Http\Controllers;

use App\Models\BookBorrowingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookBorrowingStatsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    
    public function getStats()
    {
        $this->authorize('viewAny', BookBorrowingRequest::class);
        
        $stats = [
            'pending' => BookBorrowingRequest::where('status', 'pending')->count(),
            'approved' => BookBorrowingRequest::where('status', 'approved')->whereNull('return_date')->count(),
            'returned' => BookBorrowingRequest::where('status', 'returned')->count(),
            'rejected' => BookBorrowingRequest::where('status', 'rejected')->count(),
        ];
        
        return response()->json($stats);
    }
}