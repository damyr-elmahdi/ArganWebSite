<?php

namespace Database\Seeders;

use App\Models\OutstandingStudent;
use Illuminate\Database\Seeder;

class OutstandingStudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            [
                'student_id' => 'S10023',
                'name' => 'Fatima Zahra',
                'grade' => 'Grade 12A',
                'mark' => 98,
                'achievement' => 'National Mathematics Competition Winner'
            ],
            [
                'student_id' => 'S10045',
                'name' => 'Ahmed Alaoui',
                'grade' => 'Grade 11B',
                'mark' => 95,
                'achievement' => 'Science Fair Gold Medal'
            ],
            [
                'student_id' => 'S10078',
                'name' => 'Leila Benjelloun',
                'grade' => 'Grade 12C',
                'mark' => 96,
                'achievement' => 'Outstanding Achievement in Literature'
            ],
            [
                'student_id' => 'S10112',
                'name' => 'Karim Tazi',
                'grade' => 'Grade 10A',
                'mark' => 94,
                'achievement' => 'Regional Robotics Champion'
            ],
            [
                'student_id' => 'S10067',
                'name' => 'Yasmine Berrada',
                'grade' => 'Grade 11A',
                'mark' => 97,
                'achievement' => 'Excellence in Foreign Languages'
            ],
        ];

        foreach ($students as $student) {
            OutstandingStudent::create($student);
        }
    }
}