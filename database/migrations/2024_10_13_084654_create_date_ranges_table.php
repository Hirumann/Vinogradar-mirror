<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('date_ranges', function (Blueprint $table) {
            $table->id();
            $table->string('table_name'); // Имя таблицы, к которой привязан диапазон
            $table->unsignedBigInteger('row_id'); // ID строки
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('date_ranges');
    }
};
