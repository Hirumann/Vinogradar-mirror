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
        Schema::create('sicks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('pathogen')->nullable();
            $table->string('severity')->nullable();
            $table->string('symptoms')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('biology')->nullable();
            $table->string('shield')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sicks');
    }
};
