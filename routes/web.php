<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AgroController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FieldJournalController;
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

// Routes to get day data
Route::get('/get-day-data', [AgroController::class, 'getDayData']);
Route::get('/calendar-data/{year}/{month}', [AgroController::class, 'getCalendarData']);

// Routes for add event and task
Route::post('/add-event', [AgroController::class, 'addEvent']);
Route::post('/add-task', [AgroController::class, 'addTask']);
Route::post('/add-direct', [AgroController::class, 'addDirect']);

// Routes for delete event and task
Route::delete('/delete-event/{id}', [AgroController::class, 'deleteEvent'])->name('delete-event');
Route::delete('/delete-task/{id}', [AgroController::class, 'deleteTask'])->name('delete-task');
Route::delete('/delete-direct/{id}', [AgroController::class, 'deleteDirect'])->name('delete-direct');

// Routes for update event and task range
Route::post('/set-event-range/{id}', [AgroController::class, 'setEventRange']);
Route::post('/set-task-range/{id}', [AgroController::class, 'setTaskRange']);
Route::post('/set-direct-range/{id}', [AgroController::class, 'setDirectRange']);

// Routes for get event and task range
Route::get('/get-event-range/{id}', [AgroController::class, 'getEventRange']);
Route::get('/get-task-range/{id}', [AgroController::class, 'getTaskRange']);
Route::get('/get-direct-range/{id}', [AgroController::class, 'getDirectRange']);

// Route to get Gantt data
Route::get('/get-gantt-data', [AgroController::class, 'getGanttData']);

// Routes for export page
Route::middleware('auth')->get('/export', [ExportController::class, 'exportStep1'])->name('export.step1');
Route::get('/get-events-tasks', [ExportController::class, 'getEventsTasks']);
Route::middleware('auth')->get('/export/step-2', [ExportController::class, 'exportStep2'])->name('export.step2');
Route::post('/export/backup', [ExportController::class, 'backupData'])->name('export.backup');
Route::post('/export/download-pdf', [ExportController::class, 'downloadPDF'])->name('export.download.pdf');


// Routes for Field Journal
Route::middleware('auth')->get('/field-journal', [FieldJournalController::class, 'index'])->name('field-journal');
Route::post('/field-journal/store', [FieldJournalController::class, 'store']);
Route::post('/field-journal/update/{id}', [FieldJournalController::class, 'update']);
Route::delete('/field-journal/delete/{id}', [FieldJournalController::class, 'destroy']);
Route::post('/field-journal/upload-photo/{id}', [FieldJournalController::class, 'uploadPhoto']);
Route::delete('/field-journal/delete-photo/{id}', [FieldJournalController::class, 'deletePhoto']);
Route::post('/field-journal/create', [FieldJournalController::class, 'create']);

// Routes for Directory
Route::post('/directory/{tableName}/create', [DirectoryController::class, 'createRow']);
Route::delete('/directory/{tableName}/delete/{rowId}', [DirectoryController::class, 'deleteRow']);
Route::post('/directory/{tableName}/update/{id}', [DirectoryController::class, 'updateRow']);
Route::get('/directory/{tableName}', [DirectoryController::class, 'getAllRows']);

Route::get('/get-date-ranges/{table}/{rowId}', [DirectoryController::class, 'getDateRanges']);
Route::post('/set-date-range/{table}/{rowId}', [DirectoryController::class, 'setDateRange']);
Route::post('/remove-date-range/{table}/{rowId}/{rangeId}', [DirectoryController::class, 'removeDateRange']);

Route::get('/directory/{table}/{rowId}/operations', [DirectoryController::class, 'getOperations']);
Route::post('/directory/{table}/{rowId}/operations/add', [DirectoryController::class, 'addOperation']);
Route::delete('/directory/{table}/{rowId}/operations/delete/{operationId}', [DirectoryController::class, 'deleteOperation']);

Route::post('/upload-photo/{table}/{id}', [DirectoryController::class, 'uploadPhoto']);
Route::delete('/delete-photo/{table}/{id}', [DirectoryController::class, 'deletePhoto']);

Route::get('/get-table-list', [DirectoryController::class, 'showTableSelectionModal']);
Route::post('/get-table-data', [DirectoryController::class, 'getTableData']);

