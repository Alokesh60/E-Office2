<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Application::create([
            'user_id' => 1,
            'title' => 'Leave Application',
            'status' => 'Pending'
        ]);

        \App\Models\Application::create([
            'user_id' => 1,
            'title' => 'ID Card Request',
            'status' => 'Accepted'
        ]);
    }
}
