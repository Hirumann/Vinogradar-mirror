<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AgroController extends Controller
{
    // Страница Агроплана
    public function agroplan()
    {
        return view('agroplan.agroplan');
    }
}
