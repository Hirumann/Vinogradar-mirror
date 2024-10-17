<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuncNeed extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'func_needs'
    ];
}
