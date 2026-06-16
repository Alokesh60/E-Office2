<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();

            // Folder relation
            $table->foreignId('folder_id')
                  ->constrained()
                  ->onDelete('cascade');

            // User relation
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->string('file_name');

            // Path where file is stored
            $table->string('file_path');

            // File size in bytes
            $table->bigInteger('file_size');

            // Extension (pdf, jpg, etc.)
            $table->string('file_type');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};