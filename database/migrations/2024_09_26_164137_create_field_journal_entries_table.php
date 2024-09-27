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
        Schema::create('field_journal_entries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->nullable();
            $table->string('row_bush')->nullable();
            $table->string('photo')->nullable();
            $table->text('green_operations')->nullable();
            $table->text('soil_operations')->nullable();
            $table->text('fertilizer_operations')->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_journal_entries');
    }
};
