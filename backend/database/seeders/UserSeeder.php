<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Administrator;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'ELMADHI DAMYR',
            'email' => 'ElmahdiDamyr@gmail.com',
            'password' => Hash::make('AdminElmahdi'),
            'role' => 'administrator',
        ]);

        // Create admin profile
        Administrator::create([
            'user_id' => $admin->id,
            'admin_level' => 'super',
            'department' => 'management',
        ]);

        // Create multiple students
        $students = [
            [
                'name' => 'Ahmed Bensouda',
                'email' => 'ahmed.bensouda@argan.edu',
                'grade' => 'TC-S',
            ],
            [
                'name' => 'Fatima Zahra',
                'email' => 'fatima.zahra@argan.edu',
                'grade' => 'TC-LSH',
            ],
            [
                'name' => 'Youssef Alami',
                'email' => 'youssef.alami@argan.edu',
                'grade' => '1BAC-SE',
            ],
            [
                'name' => 'Amina Tazi',
                'email' => 'amina.tazi@argan.edu',
                'grade' => '1BAC-LSH',
            ],
            [
                'name' => 'Omar El Fassi',
                'email' => 'omar.elfassi@argan.edu',
                'grade' => '2BAC-PC',
            ],
            [
                'name' => 'Salma Idrissi',
                'email' => 'salma.idrissi@argan.edu',
                'grade' => '2BAC-SVT',
            ],
            [
                'name' => 'Karim Benjelloun',
                'email' => 'karim.benjelloun@argan.edu',
                'grade' => '2BAC-SH',
            ],
            [
                'name' => 'Layla Mansouri',
                'email' => 'layla.mansouri@argan.edu',
                'grade' => '2BAC-L',
            ],
            [
                'name' => 'Mehdi Berrada',
                'email' => 'mehdi.berrada@argan.edu',
                'grade' => 'TC-S',
            ],
            [
                'name' => 'Nadia El Khattabi',
                'email' => 'nadia.elkhattabi@argan.edu',
                'grade' => '1BAC-SE',
            ],
            [
                'name' => 'Younes Saidi',
                'email' => 'younes.saidi@argan.edu',
                'grade' => '2BAC-PC',
            ],
            [
                'name' => 'Sara Bennani',
                'email' => 'sara.bennani@argan.edu',
                'grade' => '1BAC-LSH',
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
                'recovery_email' => $recoveryEmail,
            ]);
        }
    }
}