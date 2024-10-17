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
        Schema::create('green_defends', function (Blueprint $table) {
            $table->id();
            $table->string('phases')->nullable();
            $table->string('month')->nullable();
            $table->string('processing')->nullable();
            $table->integer('number_operations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('green_defends');
    }
};
