<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GreenDefend extends Model
{
    use HasFactory;

    protected $fillable = [
        'phases',
        'processing',
        'number_operations'
    ];
}
