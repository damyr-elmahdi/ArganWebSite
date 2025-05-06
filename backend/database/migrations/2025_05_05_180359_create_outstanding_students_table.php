<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('outstanding_students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->nullable();
            $table->string('name');
            $table->string('grade');
            $table->decimal('mark', 5, 2); 
            $table->string('achievement')->nullable();
            $table->string('photo_path')->nullable(); 
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('outstanding_students');
    }
};