<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grade_viewers', function (Blueprint $table) {
            $table->id();
            $table->string('id_number');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('extra_name')->nullable();
            $table->string('program')->nullable();
            $table->string('level')->nullable();
            $table->string('grade')->nullable();
            $table->date('date_validated')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_viewers');
    }
};
