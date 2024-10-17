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
        Schema::create('plotdatas', function (Blueprint $table) {
            $table->id();
            $table->string('host')->nullable();
            $table->string('plot_num')->nullable();
            $table->string('coords')->nullable();
            $table->string('square')->nullable();
            $table->string('rows_num')->nullable();
            $table->string('year_mon')->nullable();
            $table->string('sort')->nullable();
            $table->string('rootstock')->nullable();
            $table->string('schema')->nullable();
            $table->string('bush_num')->nullable();
            $table->string('ways')->nullable();
            $table->string('ways_orosh')->nullable();
            $table->string('shpalera')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plotdatas');
    }
};
