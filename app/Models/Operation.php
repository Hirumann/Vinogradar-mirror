<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = ['row_id', 'table_name', 'name', 'row_type'];

    // Связь с моделью строки (например, Phenophase)
    public function row()
    {
        return $this->morphTo();
    }
}
