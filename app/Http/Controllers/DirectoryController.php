<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    // Страница справочников
    public function directory()
    {
        return view('directory.directory');
    }
}
