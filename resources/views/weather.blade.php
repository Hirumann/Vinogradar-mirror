@extends('layouts.app')

@section('content')
    <div class="container my-32 mx-auto p-6">
        <!-- Ссылки для переключения версий -->
        <div class="flex justify-center mb-4">
            <button id="version1-btn" class="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4">Погода</button>
            <button id="version2-btn" class="px-4 py-2 bg-gray-300 text-black rounded-lg">Окружающая среда</button>
        </div>

        @if (!empty($weather))
            <!-- Версия 1 (Погода) -->
            <div id="version1" class="space-y-4">
                <!-- Виджет погоды -->
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-lg font-semibold">Текущая погода</h2>
                    <p>Температура: {{ round($weather['main']['temp'] - 273.15) }}°C</p>
                    <p>По ощущению: {{ round($weather['main']['feels_like'] - 273.15) }}°C</p>
                    <p class="flex items-center"><img src={{ 'http://openweathermap.org/img/w/' . $weather['weather'][0]['icon'] . '.png' }} alt="icon"> {{ ucfirst($weather['weather'][0]['description']) }}</p>
                    <p>Ветер: {{ $weather['wind']['speed'] }} м/c {{ $partOfWorld }}</p>
                    <p>Давление: {{ round($weather['main']['pressure'] / 1.333) }} мм рт. ст.</p>
                    <p>Влажность: {{ $weather['main']['humidity'] }}%</p>
                    <p>Облачность: {{ $weather['clouds']['all'] }}%</p>
                </div>

                <!-- Прогноз на 3 дня (статический) -->
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-lg font-semibold">Прогноз на 3 дня</h2>
                    <p>Сегодня: Температура: {{ round($weather['main']['temp'] - 273.15) }}°C, Влажность: {{ $weather['main']['humidity'] }}, Ветер: {{ $weather['wind']['speed'] }} м/с</p>
                    <p>Завтра: Температура: {{ round($weather['main']['temp'] - 273.15) - 2 }}, Влажность: {{ $weather['main']['humidity'] - 5 }}, Ветер: {{ $weather['wind']['speed'] - 0.1 }} м/с</p>
                    <p>Послезавтра: Температура: {{ round($weather['main']['temp'] - 273.15) + 3 }}°C, Влажность: {{ $weather['main']['humidity'] + 3 }}, Ветер: {{ $weather['wind']['speed'] + 0.2 }} м/с</p>
                </div>
            </div>

            <!-- Версия 2 (Окружающая среда) -->
            <div id="version2" class="hidden grid-cols-3 gap-4">
                <!-- Блоки с данными -->
                <div class="bg-white p-4 rounded-lg shadow-md border-red-500 border-2">
                    <h2 class="text-lg font-semibold">Влажность почвы</h2>
                    <p class="text-2xl">72%</p>
                    <p>Вчера: 58%</p>
                    <p class="text-sm">Выше нормы</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md {{ round($weather['main']['temp'] - 273.15) >= 35 ? 'border-red-500' : (round($weather['main']['temp'] - 273.15) <= 20 ? 'border-yellow-500' : 'border-green-500') }} border-2">
                    <h2 class="text-lg font-semibold">Температура воздуха</h2>
                    <p class="text-2xl">{{ round($weather['main']['temp'] - 273.15) }}°C</p>
                    <p>Ощущается как: {{ round($weather['main']['feels_like'] - 273.15) }}°C</p>
                    <p class="text-sm">
                        @if (round($weather['main']['temp'] - 273.15) <= 35 && round($weather['main']['temp'] >= 20))
                            Комфортно
                        @elseif (round($weather['main']['temp'] - 273.15) < 20)
                            Ниже нормы
                        @else
                            Выше нормы
                        @endif
                    </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md {{ round($weather['wind']['speed']) > 7 ? 'border-red-500' : 'border-green-500' }} border-2">
                    <h2 class="text-lg font-semibold">Скорость ветра</h2>
                    <p class="text-2xl">{{ round($weather['wind']['speed']) }} м/с</p>
                    <p>Направление: {{ $partOfWorld }}</p>
                    <p class="text-sm">
                        @if ($weather['wind']['speed'] <= 7)
                            Комфортно
                        @else
                            Выше нормы
                        @endif
                    </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md {{ $weather['main']['humidity'] >= 60 ? 'border-red-500' : ($weather['main']['humidity'] <= 20 ? 'border-yellow-500' : 'border-green-500') }} border-2">
                    <h2 class="text-lg font-semibold">Влажность</h2>
                    <p class="text-2xl">{{ $weather['main']['humidity'] }}%</p>
                    <p>Вчера: {{ $weather['main']['humidity'] + 2 }}%</p>
                    <p class="text-sm">
                        @if ($weather['main']['humidity'] <= 60 && $weather['main']['humidity'] >= 20)
                            Комфортно
                        @elseif ($weather['main']['humidity'] < 20)
                            Ниже нормы
                        @else
                            Выше нормы
                        @endif
                    </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md {{ round($weather['main']['pressure'] / 1.333) > 760 ? 'border-red-500' : (round($weather['main']['pressure'] / 1.333) < 740 ? 'border-yellow-500' : 'border-green-500') }} border-2">
                    <h2 class="text-lg font-semibold">Давление</h2>
                    <p class="text-2xl">{{ round($weather['main']['pressure'] / 1.333) }} мм рт. ст.</p>
                    <p class="text-sm">
                        @if (round($weather['main']['pressure'] / 1.333) <= 760 && round($weather['main']['pressure'] / 1.333) >= 740 )
                            Комфортно
                        @elseif (round($weather['main']['pressure'] / 1.333) < 740)
                            Ниже нормы
                        @else
                            Выше нормы
                        @endif
                    </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md border-green-500 border-2">
                    <h2 class="text-lg font-semibold">УФ индекс</h2>
                    <p class="text-2xl">3</p>
                    <p class="text-sm">Комфортно</p>
                </div>
            </div>
        @else
            <p>Не удалось загрузить погоду.</p>
        @endif
    </div>
@endsection