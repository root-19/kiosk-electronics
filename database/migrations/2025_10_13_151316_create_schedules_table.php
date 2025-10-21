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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->onDelete('cascade');
            $table->foreignId('professor_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->enum('time_slot', [
                '7:30-8:30', '8:30-9:30', '9:30-10:30', '10:30-11:30', 
                '11:30-12:30', '12:30-1:30', '1:30-2:30', '2:30-3:30', 
                '3:30-4:30', '4:30-5:30', '5:30-6:30', '6:30-7:30'
            ]);
            $table->string('room')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Ensure no duplicate schedules for same section, day, and time
            $table->unique(['section_id', 'day_of_week', 'time_slot']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
