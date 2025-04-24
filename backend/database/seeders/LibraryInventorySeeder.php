<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LibraryInventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            // Arabic Books
            [
                'title' => 'الأشجار و اغتيال مروري',
                'quantity' => 2,
                'inventory_number' => '1-2',
                'author' => 'محمود درويش',
                'category' => 'Arabic Literature'
            ],
            [
                'title' => 'البعيل',
                'quantity' => 2,
                'inventory_number' => '3-4',
                'author' => 'نجيب محفوظ',
                'category' => 'Arabic Literature'
            ],
            [
                'title' => 'سن الملح',
                'quantity' => 3,
                'inventory_number' => '5-7',
                'author' => 'عبد الرحمن منيف',
                'category' => 'Arabic Literature'
            ],
            [
                'title' => 'سبق الساعات الطويلة',
                'quantity' => 2,
                'inventory_number' => '8-9',
                'author' => 'غسان كنفاني',
                'category' => 'Arabic Literature'
            ],
            [
                'title' => 'روحا في النص',
                'quantity' => 2,
                'inventory_number' => '10-11',
                'author' => 'أدونيس',
                'category' => 'Arabic Poetry'
            ],
            [
                'title' => 'المناخ في اللغة والاعلام',
                'quantity' => 2,
                'inventory_number' => '12-13',
                'author' => 'محمد عابد الجابري',
                'category' => 'Arabic Language'
            ],
            [
                'title' => 'علم الاجتماع',
                'quantity' => 2,
                'inventory_number' => '23-24',
                'author' => 'علي الوردي',
                'category' => 'Social Sciences'
            ],
            
            // French Books
            [
                'title' => 'Les œuvres integrales',
                'quantity' => 6,
                'inventory_number' => '190-195',
                'author' => 'Various Authors',
                'category' => 'French Literature'
            ],
            [
                'title' => 'L\'Île des esclaves',
                'quantity' => 1,
                'inventory_number' => '198',
                'author' => 'Pierre de Marivaux',
                'category' => 'French Literature'
            ],
            [
                'title' => 'La piste',
                'quantity' => 1,
                'inventory_number' => '199',
                'author' => 'Jean-Christophe Grangé',
                'category' => 'French Literature'
            ],
            [
                'title' => 'Le petit prince',
                'quantity' => 1,
                'inventory_number' => '239',
                'author' => 'Antoine de Saint-Exupéry',
                'category' => 'French Literature'
            ],
            
            // English Books
            [
                'title' => 'Dracula',
                'quantity' => 1,
                'inventory_number' => '196',
                'author' => 'Bram Stoker',
                'category' => 'English Literature'
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'quantity' => 2,
                'inventory_number' => '240-241',
                'author' => 'Harper Lee',
                'category' => 'English Literature'
            ],
            [
                'title' => '1984',
                'quantity' => 3,
                'inventory_number' => '242-244',
                'author' => 'George Orwell',
                'category' => 'English Literature'
            ],
            [
                'title' => 'The Great Gatsby',
                'quantity' => 2,
                'inventory_number' => '245-246',
                'author' => 'F. Scott Fitzgerald',
                'category' => 'English Literature'
            ],
            
            // Science Books
            [
                'title' => 'A Brief History of Time',
                'quantity' => 1,
                'inventory_number' => '247',
                'author' => 'Stephen Hawking',
                'category' => 'Science'
            ],
            [
                'title' => 'الفيزياء الحديثة',
                'quantity' => 2,
                'inventory_number' => '248-249',
                'author' => 'أحمد زويل',
                'category' => 'Science'
            ],
            [
                'title' => 'Introduction to Algebra',
                'quantity' => 4,
                'inventory_number' => '250-253',
                'author' => 'Michael Artin',
                'category' => 'Mathematics'
            ],
        ];

        foreach ($books as $book) {
            // Insert the book record
            DB::table('library_items')->insert([
                'title' => $book['title'],
                'author' => $book['author'],
                'category' => $book['category'],
                'quantity' => $book['quantity'],
                'inventory_number' => $book['inventory_number'],
                'description' => 'Book description for ' . $book['title'],
                'image_path' => null,
                'available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}