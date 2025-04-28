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
            ['name' => 'Science', 'description' => 'Science-related quizzes'],
            ['name' => 'History', 'description' => 'History-related quizzes'],
            ['name' => 'English', 'description' => 'English language quizzes'],
            ['name' => 'Computer Science', 'description' => 'Computer science quizzes'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}