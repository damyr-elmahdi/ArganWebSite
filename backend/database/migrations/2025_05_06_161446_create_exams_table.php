<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->foreignId('subject_id')->constrained('subjects');
            $table->string('class_name'); // e.g., "10A", "11B", etc.
            $table->string('room')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('exams');
    }
};