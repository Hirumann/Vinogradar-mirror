<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meteodata extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'battery',
        'sun_activity',
        'min_t',
        'max_t',
        'avg_t',
        'humidity',
        'humidity_letter',
        'ground_t'
    ];
}
