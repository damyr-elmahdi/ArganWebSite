<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookBorrowing;
use App\Models\LibraryItem;
use App\Models\User;
use Carbon\Carbon;

class BookBorrowingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some library items
        $libraryItems = LibraryItem::take(5)->get();
        
        // Get some student users
        $students = User::where('role', 'student')->take(3)->get();
        
        if ($libraryItems->isEmpty()) {
            $this->command->info('No library items found. Please seed library items first.');
            return;
        }
        
        if ($students->isEmpty()) {
            $this->command->info('No student users found. Please seed users first.');
            return;
        }
        
        // Create some borrowed books
        foreach ($libraryItems as $index => $item) {
            // Skip if item quantity is already 0
            if ($item->quantity <= 0) continue;
            
            $student = $students[$index % $students->count()];
            
            // Create a borrowing record
            BookBorrowing::create([
                'library_item_id' => $item->id,
                'student_id' => $student->id,
                'status' => 'borrowed',
                'request_date' => Carbon::now()->subDays(rand(1, 10)),
            ]);
            
            // Decrease the item quantity
            $item->decrement('quantity');
        }
        
        // Create some returned books
        foreach ($libraryItems->take(3) as $index => $item) {
            $student = $students[($index + 1) % $students->count()];
            
            // Create a borrowing record that has been returned
            BookBorrowing::create([
                'library_item_id' => $item->id,
                'student_id' => $student->id,
                'status' => 'returned',
                'request_date' => Carbon::now()->subDays(rand(11, 20)),
                'return_date' => Carbon::now()->subDays(rand(1, 5)),
            ]);
        }
        
        $this->command->info('Book borrowings seeded successfully.');
    }
}