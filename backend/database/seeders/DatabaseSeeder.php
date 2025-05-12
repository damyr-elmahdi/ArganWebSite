<?php

namespace Database\Seeders;

use App\Models\BookBorrowing;
use App\Models\Club;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AdminSeeder::class,
            StudentSeeder::class,
            TeacherSeeder::class,
            LibrarianSeeder::class,
            ClubSeeder::class,
            BookBorrowingsSeeder::class,
            EnglishQuizSeeder::class,
            LibraryInventorySeeder::class,
            OutstandingStudentsSeeder::class,
            SubjectsTableSeeder::class,

        ]);
    }
}