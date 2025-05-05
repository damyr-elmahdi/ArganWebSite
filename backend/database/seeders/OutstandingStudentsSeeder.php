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
                'grade' => '2BAC-PC',
                'mark' => 19.5,
                'achievement' => 'Compétition Nationale de Mathématiques - 1er Prix'
            ],
            [
                'student_id' => 'S10045',
                'name' => 'Ahmed Alaoui',
                'grade' => '1BAC-SE',
                'mark' => 18.25,
                'achievement' => 'Médaille d\'Or - Foire Scientifique'
            ],
            [
                'student_id' => 'S10078',
                'name' => 'Leila Benjelloun',
                'grade' => '2BAC-L',
                'mark' => 19,
                'achievement' => 'Mention Excellente en Littérature'
            ],
            [
                'student_id' => 'S10112',
                'name' => 'Karim Tazi',
                'grade' => 'TC-S',
                'mark' => 17.75,
                'achievement' => 'Champion Régional de Robotique'
            ],
            [
                'student_id' => 'S10067',
                'name' => 'Yasmine Berrada',
                'grade' => '1BAC-LSH',
                'mark' => 18.5,
                'achievement' => 'Excellence en Langues Étrangères'
            ],
        ];

        foreach ($students as $student) {
            OutstandingStudent::create($student);
        }
    }
}