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
        // Add columns to sports table
        Schema::table('sports', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->text('description')->nullable()->after('name');
        });

        // Add columns to delegates table
        Schema::table('delegates', function (Blueprint $table) {
            $table->foreignId('sport_id')->after('id')->constrained()->onDelete('cascade');
            $table->string('name')->after('sport_id');
            $table->string('position')->nullable()->after('name');
            $table->string('image_path')->nullable()->after('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sports', function (Blueprint $table) {
            $table->dropColumn(['name', 'description']);
        });

        Schema::table('delegates', function (Blueprint $table) {
            $table->dropForeign(['sport_id']);
            $table->dropColumn(['sport_id', 'name', 'position', 'image_path']);
        });
    }
};
