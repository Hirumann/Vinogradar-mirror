<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class AuthController extends Controller
{
    // Экран приветствия
    public function welcome()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return view('welcome');
    }


    // Показать форму логина
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Логика авторизации
    public function login(Request $request)
    {
        /*
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('dashboard');
        }

        return back()->withErrors([
            'email' => 'Неверные данные для входа.',
        ]);
        */
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            return redirect()->route('dashboard');
        }

        return back()->withErrors([
            'email' => 'Неверный логин или пароль',
        ]);
    }

    // Показать форму регистрации
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // Логика регистрации
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:32',
            'surname' => 'required|string|max:32',
            'password' => 'required|min:8|max:16|confirmed',
        ]);

        // Создание пользователя
        User::create([
            'email' => $request->email,
            'name' => $request->name,
            'surname' => $request->surname,
            'password' => Hash::make($request->password),
        ]);

        Auth::attempt($request->only('email', 'password'));
        
        return redirect()->route('dashboard');
    }

    // Личный кабинет
    public function dashboard()
    {
        return view('dashboard', [
            'weather' => $this->getWeather()
        ]);
    }

    private function getWeather()
    {
        $apiKey = env('WEATHER_API_KEY'); // Задать ключ через .env
        $url = "https://api.openweathermap.org/data/2.5/weather?lat=44.6&lon=33.53&appid=$apiKey&lang=ru";

        // Используем HTTP клиент Laravel для отправки запроса
        $response = Http::get($url);
        
        if ($response->successful()) {
            return $response->json();
        }

        return null; // Если API не вернул ответ
    }

    // Страница контактов
    public function contacts()
    {
        return view('auth.contacts');
    }
}
