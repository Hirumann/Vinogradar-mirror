<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClimaticParametre extends Model
{
    use HasFactory;

    protected $fillable = [
        'sum_t_ten',
        'sum_t_twenty',
        'ind_hug',
        'ind_uink',
        'avg_t_spt',
        'avg_t_veget',
        'gtk',
        'ann_precip',
        'precip',
        'spt_precip'
    ];
}
