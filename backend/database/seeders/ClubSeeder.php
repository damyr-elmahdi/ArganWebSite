<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $clubs = [
            [
                'name' => 'Science Club',
                'description' => 'Explore the wonders of science through experiments, discussions, and field trips.',
                'activities' => 'Our activities include weekly lab experiments where members get hands-on experience with scientific concepts. We participate in local and regional science fairs to showcase our projects. We also invite guest lecturers to share their expertise and inspire our members.',
                'meeting_schedule' => 'Every Tuesday and Thursday, 3:30 PM - 5:00 PM'
            ],
            [
                'name' => 'Debate Club',
                'description' => 'Develop critical thinking and public speaking skills through structured debates.',
                'activities' => 'Weekly debates on current events and philosophical topics. Regional competitions against other schools. Public speaking workshops to improve confidence and persuasion skills.',
                'meeting_schedule' => 'Every Monday and Wednesday, 4:00 PM - 5:30 PM'
            ],
            [
                'name' => 'Art Club',
                'description' => 'Express creativity through various art forms and techniques.',
                'activities' => 'Art exhibitions displaying student work. Creative workshops exploring different mediums like painting, sculpture, and digital art. Museum visits to gain inspiration from established artists.',
                'meeting_schedule' => 'Every Friday, 3:00 PM - 5:00 PM'
            ]
        ];

        foreach ($clubs as $club) {
            Club::create($club);
        }
    }
}