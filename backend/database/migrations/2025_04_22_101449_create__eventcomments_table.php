<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Make news_id nullable
            $table->unsignedBigInteger('news_id')->nullable()->change();
            
            // Add event_id column
            $table->unsignedBigInteger('event_id')->nullable()->after('news_id');
            
            // Add foreign key constraint
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Remove foreign key and column
            $table->dropForeign(['event_id']);
            $table->dropColumn('event_id');
            
            // Make news_id required again
            $table->unsignedBigInteger('news_id')->nullable(false)->change();
        });
    }
};