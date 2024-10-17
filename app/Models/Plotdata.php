<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plotdata extends Model
{
    use HasFactory;

    protected $fillable = [
        'host',
        'plot_num',
        'coords',
        'square',
        'rows_num',
        'year_mon',
        'rootstock',
        'schema',
        'bush_num',
        'ways',
        'ways_orosh',
        'shpalera',
    ];

    public function operations()
    {
        return $this->morphMany(Operation::class, 'row');
    }
}
