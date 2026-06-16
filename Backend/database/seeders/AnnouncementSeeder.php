<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Announcement::create([
            'title' => 'Office Closed',
            'message' => 'Office will remain closed on Friday',
            'active' => true
        ]);

        \App\Models\Announcement::create([
            'title' => 'New Policy Update',
            'message' => 'Please check the updated office policies.',
            'active' => true
        ]);
    }
}
