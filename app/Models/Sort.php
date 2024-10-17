<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sort extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'photo_berry',
        'photo_piece',
        'parametres',
        'time_to_grow',
        'sugar',
        'toxic',
        'koef_baby',
        'bush_u',
        'babywork',
        'stable_sick',
        'stable_thirst',
        'stable_froze',
    ];
}
