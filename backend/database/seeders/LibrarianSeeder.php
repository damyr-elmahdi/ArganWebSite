<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class LibrarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First create users with librarian role
        $librarians = [
            [
                'name' => 'Main Librarian',
                'email' => 'librarian@school.com',
                'password' => Hash::make('password'),
                'role' => 'librarian',
            ],
        ];

        foreach ($librarians as $librarian) {
            // Insert the user
            $userId = DB::table('users')->insertGetId([
                'name' => $librarian['name'],
                'email' => $librarian['email'],
                'password' => $librarian['password'],
                'role' => $librarian['role'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create the librarian record linked to the user
            DB::table('librarians')->insert([
                'user_id' => $userId,
                'staff_id' => 'LIB-' . str_pad($userId,-4, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}