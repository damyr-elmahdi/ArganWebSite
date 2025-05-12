<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            ['name' => 'Mathematics', 'description' => 'Math-related quizzes'],
            ['name' => 'Physics & Chemistry', 'description' => 'Physics & Chemistry-related quizzes'],
            ['name' => 'SVT', 'description' => 'SVT-related quizzes'],
            ['name' => 'History and Geography', 'description' => 'History and Geography-related quizzes'],
            ['name' => 'Islamic Education', 'description' => 'Islamic Education-related quizzes'],
            ['name' => 'Philosophies', 'description' => 'Philosophies-related quizzes'],
            ['name' => 'English', 'description' => 'English language quizzes'],
            ['name' => 'Franch', 'description' => 'Franch language quizzes'],
            ['name' => 'Arabic', 'description' => 'Arabic language quizzes'],
            ['name' => 'English', 'description' => 'English language quizzes'],
            ['name' => 'Computer Science', 'description' => 'Computer science quizzes'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}