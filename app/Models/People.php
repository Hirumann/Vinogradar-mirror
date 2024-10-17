<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class People extends Model
{
    use HasFactory;

    // Поля, которые могут быть заполнены через массовое присвоение
    protected $fillable = [
        'name',
        'func_needs',
        'phone',
        'comments'
    ];
}
