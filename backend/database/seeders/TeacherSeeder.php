<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    public function run()
    {
        // Create a few teacher users
        $teachers = [
            [
                'name' => 'Ahmed Hassan',
                'email' => 'ahmed.hassan@arganhighschool.edu', 
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'employee_id' => 'T10001',
                'department' => 'Mathematics'
            ],
            [
                'name' => 'Fatima Zahra',
                'email' => 'fatima.zahra@arganhighschool.edu',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'employee_id' => 'T10002',
                'department' => 'Science'
            ],
            [
                'name' => 'Mohammed El Amrani',
                'email' => 'mohammed.amrani@arganhighschool.edu',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'employee_id' => 'T10003',
                'department' => 'Languages'
            ]
        ];
        
        foreach ($teachers as $teacherData) {
            $employeeId = $teacherData['employee_id'];
            $department = $teacherData['department'];
            
            // Remove non-user fields
            unset($teacherData['employee_id']);
            unset($teacherData['department']);
            
            // Create user
            $user = User::create($teacherData);
            
            // Create teacher profile
            Teacher::create([
                'user_id' => $user->id,
                'employee_id' => $employeeId,
                'department' => $department,
                'is_active' => true
            ]);
        }
    }
}