<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('student_id')->nullable();       // ID: 24KX100
            $table->string('avatar')->nullable();           // profile photo path
            $table->string('department')->nullable();       // Computer Science
            $table->string('programme')->nullable();        // B.Tech
            $table->string('semester')->nullable();         // 1st Semester
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['student_id', 'avatar', 'department', 'programme', 'semester']);
        });
    }
};