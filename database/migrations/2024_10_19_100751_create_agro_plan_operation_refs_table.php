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
        Schema::create('agro_plan_operation_refs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reference_row_id'); 
            $table->string('reference_table'); 
            $table->date('start_date');
            $table->date('end_date'); 
            $table->date('name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agro_plan_operation_refs');
    }
};
