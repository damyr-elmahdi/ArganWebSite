<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('grade_applying_for');
            $table->string('parent_name');
            $table->string('parent_occupation');
            $table->string('father_phone');
            $table->string('mother_phone');
            $table->string('student_phone')->nullable();
            $table->string('family_status');
            $table->date('orphan_date')->nullable();
            $table->text('address');
            $table->string('previous_school')->nullable();
            $table->text('additional_notes')->nullable();
            $table->string('info_packet_path')->nullable(); 
            $table->boolean('processed')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('registrations');
    }
};