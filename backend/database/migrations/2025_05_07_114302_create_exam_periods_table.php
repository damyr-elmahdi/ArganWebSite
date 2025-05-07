<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('exam_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "First Semester Exams 2024/2025"
            $table->text('description')->nullable();
            $table->date('exam_date'); // Single date for the exam
            $table->integer('number_of_exams')->default(3); // Configurable number of exams
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('exam_periods');
    }
};