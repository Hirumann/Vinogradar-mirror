<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldJournalEntry extends Model
{
    use HasFactory;

    protected $table = 'field_journal_entries';

    // Поля, которые могут быть заполнены через массовое присвоение
    protected $fillable = [
        'full_name',
        'row_bush',
        'photo',
        'green_operations',
        'soil_operations',
        'fertilizer_operations',
        'comments'
    ];
}
