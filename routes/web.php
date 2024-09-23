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

Route::get('/show-weather', [AuthController::class, 'showWeather'])->name('show-weather');

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

// Route to get day data
Route::get('/get-day-data', [AgroController::class, 'getDayData']);
Route::get('/calendar-data/{year}/{month}', [AgroController::class, 'getCalendarData']);

// Route for add event and task
Route::post('/add-event', [AgroController::class, 'addEvent']);
Route::post('/add-task', [AgroController::class, 'addTask']);

// Route for delete event and task
Route::delete('/delete-event/{id}', [AgroController::class, 'deleteEvent'])->name('delete-event');
Route::delete('/delete-task/{id}', [AgroController::class, 'deleteTask'])->name('delete-task');

// Route for update event and task range
Route::post('/set-event-range/{id}', [AgroController::class, 'setEventRange']);
Route::post('/set-task-range/{id}', [AgroController::class, 'setTaskRange']);

// Route for get event and task range
Route::get('/get-event-range/{id}', [AgroController::class, 'getEventRange']);
Route::get('/get-task-range/{id}', [AgroController::class, 'getTaskRange']);


// Route to get Gantt data
Route::get('/get-gantt-data', [AgroController::class, 'getGanttData']);
