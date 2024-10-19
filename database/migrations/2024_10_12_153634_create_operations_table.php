<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();  // Уникальный ID для каждого мероприятия
            $table->unsignedBigInteger('row_id');  // ID строки (связывается с таблицей "Фенофазы" или другими таблицами)
            $table->unsignedBigInteger('row_id_other');
            $table->string('name')->nullable();  
            $table->string('table_name');   
            $table->timestamps();  // Метки времени для создания и обновления мероприятия
        });
    }

    public function down()
    {
        Schema::dropIfExists('operations');
    }
};
