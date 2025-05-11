<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Administrator;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
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
    }
}