<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meteodatas', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable();
            $table->string('battery')->nullable();
            $table->string('sun_activity')->nullable();
            $table->integer('min_t')->nullable();
            $table->integer('max_t')->nullable();
            $table->integer('avg_t')->nullable();
            $table->string('humidity')->nullable();
            $table->string('humidity_letter')->nullable();
            $table->integer('ground_t')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meteodatas');
    }
};
