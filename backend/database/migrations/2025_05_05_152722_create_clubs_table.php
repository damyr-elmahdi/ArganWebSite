<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->text('activities');
            $table->string('meeting_schedule')->nullable();
            $table->timestamps();
        });
        
        Schema::create('club_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('member'); // member, leader, assistant
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('club_members');
        Schema::dropIfExists('clubs');
    }
};