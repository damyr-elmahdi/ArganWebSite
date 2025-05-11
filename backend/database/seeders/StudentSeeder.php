<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define grade structure to match the ExamManagement component
        $grades = [
            "TC-S" => "TC - Sciences",
            "TC-LSH" => "TC - Lettres et Sciences Humaines",
            "1BAC-SE" => "1BAC - Sciences Expérimentales",
            "1BAC-LSH" => "1BAC - Lettres et Sciences Humaines",
            "2BAC-PC" => "2BAC - PC (Physique-Chimie)",
            "2BAC-SVT" => "2BAC - SVT (Sciences de la Vie et de la Terre)",
            "2BAC-SH" => "2BAC - Sciences Humaines",
            "2BAC-L" => "2BAC - Lettres",
        ];

        // Create multiple students with consistent class naming
        $students = [
            [
                'name' => 'Ahmed Bensouda',
                'email' => 'ahmed.bensouda@argan.edu',
                'grade' => 'TC-S',
                'class_code' => 'TC1',
            ],
            [
                'name' => 'Fatima Zahra',
                'email' => 'fatima.zahra@argan.edu',
                'grade' => 'TC-LSH',
                'class_code' => 'TC2',
            ],
            [
                'name' => 'Youssef Alami',
                'email' => 'youssef.alami@argan.edu',
                'grade' => '1BAC-SE',
                'class_code' => '1BAC1',
            ],
            [
                'name' => 'Amina Tazi',
                'email' => 'amina.tazi@argan.edu',
                'grade' => '1BAC-LSH',
                'class_code' => '1BAC2',
            ],
            [
                'name' => 'Omar El Fassi',
                'email' => 'omar.elfassi@argan.edu',
                'grade' => '2BAC-PC',
                'class_code' => '2BAC1',
            ],
            [
                'name' => 'Salma Idrissi',
                'email' => 'salma.idrissi@argan.edu',
                'grade' => '2BAC-SVT',
                'class_code' => '2BAC2',
            ],
            [
                'name' => 'Karim Benjelloun',
                'email' => 'karim.benjelloun@argan.edu',
                'grade' => '2BAC-SH',
                'class_code' => '2BAC3',
            ],
            [
                'name' => 'Layla Mansouri',
                'email' => 'layla.mansouri@argan.edu',
                'grade' => '2BAC-L',
                'class_code' => '2BAC4',
            ],
            [
                'name' => 'Mehdi Berrada',
                'email' => 'mehdi.berrada@argan.edu',
                'grade' => 'TC-S',
                'class_code' => 'TC3',
            ],
            [
                'name' => 'Nadia El Khattabi',
                'email' => 'nadia.elkhattabi@argan.edu',
                'grade' => '1BAC-SE',
                'class_code' => '1BAC3',
            ],
            [
                'name' => 'Younes Saidi',
                'email' => 'younes.saidi@argan.edu',
                'grade' => '2BAC-PC',
                'class_code' => '2BAC5',
            ],
            [
                'name' => 'Sara Bennani',
                'email' => 'sara.bennani@argan.edu',
                'grade' => '1BAC-LSH',
                'class_code' => '1BAC4',
            ],
        ];

        $currentYear = date('Y');
        $studentPassword = Hash::make('StudentPassword123');

        foreach ($students as $index => $studentData) {
            // Create user account
            $user = User::create([
                'name' => $studentData['name'],
                'email' => $studentData['email'],
                'password' => $studentPassword,
                'role' => 'student',
            ]);

            // Generate recovery email from main email
            $recoveryEmail = str_replace('@argan.edu', '@gmail.com', $studentData['email']);

            // Create student profile with ID format SYYYY0001
            Student::create([
                'user_id' => $user->id,
                'student_id' => 'S' . $currentYear . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'grade' => $studentData['grade'],
                'class_code' => $studentData['class_code'],
                'recovery_email' => $recoveryEmail,
            ]);
        }
    }
}