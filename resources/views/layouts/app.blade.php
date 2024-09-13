<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Личный кабинет')</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <header>
        <!-- Хедер -->
        <div class="header-container">
            <div class="burger-menu">
                <!-- Бургер меню -->
                <button class="burger">☰</button>
            </div>
            <div class="logout">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit">Выйти</button>
                </form>
            </div>
        </div>
    </header>

    <!-- Основной контент -->
    <main>
        @yield('content')
    </main>

    <!-- Футер -->
    <footer>
        <div class="footer-container">
            <div class="left-links">
                <a href="{{ route('dashboard') }}">Личный кабинет</a>
                <a href="#">Контакты</a> <!-- Пока нет страницы -->
            </div>
            <div class="social-icons">
                <a href="https://vk.com" target="_blank">ВКонтакте</a>
                <a href="https://t.me" target="_blank">Телеграм</a>
                <a href="https://zen.yandex.ru" target="_blank">Яндекс Дзен</a>
            </div>
        </div>
    </footer>
</body>
</html>
