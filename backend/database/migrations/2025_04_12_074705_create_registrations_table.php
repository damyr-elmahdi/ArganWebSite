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
            $table->string('parent_name')->nullable();
            $table->string('parent_occupation')->nullable();
            $table->string('father_phone')->nullable();
            $table->string('mother_phone')->nullable();
            $table->string('student_phone')->nullable();
            $table->string('family_status')->nullable();
            $table->date('orphan_date')->nullable();
            $table->date('date_of_birth');
            $table->text('address');
            $table->string('previous_school')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('registrations');
    }
};