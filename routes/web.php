<?php

use App\Http\Controllers\AuthController;
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
