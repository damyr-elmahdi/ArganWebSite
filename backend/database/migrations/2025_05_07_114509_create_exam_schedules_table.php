<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {

        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_period_id')->constrained()->onDelete('cascade');
            $table->string('class_code'); // e.g., "TC-S", "1BAC-SE", etc.
            $table->string('subject');  // e.g., "Mathematics", "Arabic", etc.
            $table->foreignId('teacher_id')->nullable()->constrained('teachers');
            $table->date('exam_date');
            $table->integer('exam_order'); // 1st exam, 2nd exam, etc.
            $table->text('notes')->nullable();
            $table->timestamps();

            // Add a unique constraint for exam_period, class, subject and exam_order
            $table->unique(['exam_period_id', 'class_code', 'subject', 'exam_order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('exam_schedules');
    }
};