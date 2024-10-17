<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sick extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'pathogen',
        'severity',
        'symptoms',
        'photo_url',
        'biology',
        'shield'
    ];
}
