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
        \App\Models\CalendarEvent::create([
            'title' => 'Republic Day',
            'type' => 'holiday',
            'date' => '2026-01-26'
        ]);

        \App\Models\CalendarEvent::create([
            'title' => 'Document Submission',
            'type' => 'deadline',
            'date' => '2026-01-30'
        ]);
    }
}
