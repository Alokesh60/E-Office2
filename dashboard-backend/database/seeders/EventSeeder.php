<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Event::create([
            'title' => 'Republic Day',
            'type' => 'Holiday',
            'event_date' => '2026-01-26'
        ]);

        \App\Models\Event::create([
            'title' => 'Document Submission',
            'type' => 'Deadline',
            'event_date' => '2026-01-30'
        ]);
    }
}
