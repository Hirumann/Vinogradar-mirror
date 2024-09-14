@extends('layouts.app')

@section('content')
<div class="container mx-auto p-4">
    <div class="flex justify-between items-start">
        <!-- Ссылки с иконками -->
        <div class="flex flex-col space-y-4">
            <a href="{{ route('agroplan') }}" class="flex items-center p-4 hover:bg-gray-100">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <!-- Иконка SVG -->
                </svg>
                <span>Агроплан</span>
            </a>
            <a href="{{ route('directory') }}" class="flex items-center p-4 hover:bg-gray-100">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <!-- Иконка SVG -->
                </svg>
                <span>Справочник</span>
            </a>
        </div>

        <!-- Блок с кастомным скроллом -->
        <div class="relative w-2/3 h-96 bg-gray-100 p-4 overflow-hidden rounded-lg shadow-md">
            <div id="scrollable-content" class="overflow-y-auto pr-4 h-full hide-scrollbar">
                <!-- Блок погоды -->
                <div class="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 class="text-lg font-semibold">Погода</h2>
                    @if($weather)
                        <div class="flex justify-between items-center">
                            <div>
                                <h3>Сейчас:</h3>
                                <p>Температура: {{ round($weather['main']['temp'] - 273.15) }}°C</p>
                                <p>Влажность: {{ $weather['main']['humidity'] }}%</p>
                                <p>Скорость ветра: {{ round($weather['wind']['speed'], 2) }} м/с</p>
                                <p>{{ ucfirst($weather['weather'][0]['description']) }}</p>
                            </div>
                            <div class="mr-10">
                                <h3>Сегодня:</h3>
                                <p>Температура: {{ round($weather['main']['temp'] - 273.15) - 2.1 }}°C</p>
                                <p>Влажность: {{ $weather['main']['humidity'] + 3 }}%</p>
                                <p>Скорость ветра: {{ round($weather['wind']['speed'], 2) + 0.2 }} м/с</p>
                                <p>{{ ucfirst($weather['weather'][0]['description']) }}</p>
                            </div>
                        </div>
                    @else
                        <p>Не удалось получить данные о погоде.</p>
                    @endif
                </div>

                <!-- Блок уведомлений -->
                <div class="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 class="text-lg font-semibold">Уведомления</h2>
                    <p>Нет новых уведомлений.</p>
                </div>

                <!-- Блок с планами -->
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-lg font-semibold">События и план работ</h2>
                    <p>Нет событий на сегодня.</p>
                </div>
            </div>
            <div id="custom-scrollbar" class="absolute right-0 top-4 h-full w-1 bg-gray-400 rounded"></div>
        </div>
    </div>
</div>
@endsection
