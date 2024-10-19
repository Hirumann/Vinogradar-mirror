<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgroPlanOperationRef extends Model
{
    use HasFactory;

    protected $fillable = [
        'agroplan_id',
        'reference_row_id',
        'reference_table',
        'start_date',
        'start_date',
        'end_date',
        'name'
    ];
}
