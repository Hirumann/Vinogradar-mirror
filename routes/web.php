<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AgroController;
use App\Http\Controllers\DirectoryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Экран приветствия
Route::get('/', [AuthController::class, 'welcome'])->name('welcome');

// Страница входа
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// Страница регистрации
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('welcome');
})->name('logout');

// Личный кабинет (только для авторизованных пользователей)
Route::middleware('auth')->get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

// Страница агроплана (только для авторизованных пользователей)
Route::middleware('auth')->get('/agroplan', [AgroController::class, 'agroplan'])->name('agroplan');

// Страница справочников (только для авторизованных пользователей)
Route::middleware('auth')->get('/directory', [DirectoryController::class, 'directory'])->name('directory');

// Страница контактов (только для авторизованных пользователей)
Route::middleware('auth')->get('/contacts', [AuthController::class, 'contacts'])->name('contacts');

// Страница "Погода" (только для авторизованных пользователей)
Route::middleware('auth')->get('/weather', [AuthController::class, 'weather'])->name('weather');