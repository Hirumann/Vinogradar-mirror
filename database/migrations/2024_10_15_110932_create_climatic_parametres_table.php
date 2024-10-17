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
        Schema::create('climatic_parametres', function (Blueprint $table) {
            $table->id();
            $table->integer('sum_t_ten')->nullable();
            $table->integer('sum_t_twenty')->nullable();
            $table->integer('ind_hug')->nullable();
            $table->integer('ind_uink')->nullable();
            $table->integer('avg_t_spt')->nullable();
            $table->integer('avg_t_veget')->nullable();
            $table->integer('gtk')->nullable();
            $table->integer('ann_precip')->nullable();
            $table->integer('precip')->nullable();
            $table->integer('spt_precip')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('climatic_parametres');
    }
};
