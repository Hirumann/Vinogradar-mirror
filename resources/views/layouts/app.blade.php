<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Личный кабинет')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cuprum:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
</head>
<body class="font-fontProjects">
    <div class="flex flex-col h-screen">
        <header class="h-[150px] w-full flex justify-end items-center bg-[#00CC66] relative">
            <div class="flex justify-center items-center absolute top-full left-20 -translate-y-1/2">
                <button id="burger" class="relative w-10 h-10 focus:outline-none mr-8 mt-20">
                    <span class="burger-line top-0"></span>
                    <span class="burger-line my-1"></span>
                    <span class="burger-line bottom-0"></span>
                </button>
                <div class="mr-5">{!! file_get_contents(public_path('svg/avatar_big_icon.svg')) !!}</div>
                <div>
                    <div class="text-white text-[30px] uppercase font-bold">{{ Auth::user()->surname}} {{ Auth::user()->name }}</div>
                    <div id="weather-widget" class="flex justify-start items-center text-[20px] font-bold mt-5"></div>
                </div>
            </div>
            <div class="logout mr-20">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="h-16 w-48 flex justify-evenly items-center bg-white rounded-[40px] text-[19px] text-[#00CC66] font-extrabold uppercase transition-all hover:bg-gray-100 active:bg-gray-200">{!! file_get_contents(public_path('svg/avatar_icon.svg')) !!} Выйти</button>
                </form>
            </div>
        </header>

        <main class="flex grow items-center">
            @yield('content')
        </main>

        <footer class="h-[150px] w-full text-[32px]">
            <div class="h-full w-full flex justify-around items-center text-center">
                <div class="w-1/3 flex justify-start ml-20 ">
                    <a href="{{ route('dashboard') }}" class="mr-32 relative animated-link">на главную</a>
                    <a href="{{ route('contacts') }}" class="relative animated-link">контакты</a>
                </div>
                <div class="w-1/2 flex justify-center items-center">
                    <div class="mr-5 transition-all duration-200 ease-in-out hover:-rotate-12">{!! file_get_contents(public_path('svg/logo_mini_icon.svg')) !!}</div>
                    <p>&copy; ООО "Цифровой виноградник"</p>
                </div>
                <div class="w-1/4 flex justify-end mr-20">
                    <a href="https://vk.com/club226846983" target="_blank" class="mr-5 transition-all hover:scale-110">{!! file_get_contents(public_path('svg/vk_icon.svg')) !!}</a>
                    <a href="https://t.me/smartvineyard" target="_blank" class="mr-5 transition-all hover:scale-110">{!! file_get_contents(public_path('svg/tg_icon.svg')) !!}</a>
                    <a href="https://dzen.ru/id/66b1ca3525f9e02d01bebf8d" target="_blank" class="transition-all hover:scale-110 ">{!! file_get_contents(public_path('svg/dzen_icon.svg')) !!}</a>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>
