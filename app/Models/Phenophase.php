<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phenophase extends Model
{
    use HasFactory;

    // Поля, которые могут быть заполнены через массовое присвоение
    protected $fillable = [
        'name',
        'description'
    ];

    public function operations()
    {
        return $this->morphMany(Operation::class, 'row');
    }
}
