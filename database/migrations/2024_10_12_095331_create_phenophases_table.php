<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('phenophases', function (Blueprint $table) {
            $table->id();  // ID, автоматически
            $table->string('name')->nullable();  // Наименование
            $table->string('month')->nullable();
            $table->integer('duration')->nullable();
            $table->string('description', 512)->nullable();  // Описание с лимитом 512 символов
            $table->string('agrotechnical_operations')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('phenophases');
    }
};
