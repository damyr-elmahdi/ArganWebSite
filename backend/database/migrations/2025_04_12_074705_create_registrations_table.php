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
            $table->string('email');
            $table->date('date_of_birth');
            $table->string('phone');
            $table->text('address');
            $table->string('previous_school')->nullable();
            $table->string('grade_applying_for');
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