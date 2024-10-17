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
        Schema::create('sorts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->string('photo_berry')->nullable();
            $table->string('photo_piece')->nullable();
            $table->string('parametres')->nullable();
            $table->string('time_to_grow')->nullable();
            $table->string('sugar')->nullable();
            $table->string('toxic')->nullable();
            $table->string('koef_baby')->nullable();
            $table->string('bush_u')->nullable();
            $table->string('babywork')->nullable();
            $table->string('stable_sick')->nullable();
            $table->string('stable_thirst')->nullable();
            $table->string('stable_froze')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sorts');
    }
};
