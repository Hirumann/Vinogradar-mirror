<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация</title>
    @vite('resources/css/app.css')
</head>
<body class="h-screen">
    <div class="h-full w-1/3 mx-auto flex flex-col justify-center items-center">
        <h1 class="text-xl font-bold mb-4">Регистрация</h1>

        <form action="{{ route('register') }}" method="POST" class="flex flex-col justify-center items-center">
            @csrf
            @error('email')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
            @enderror

            <!-- Email -->
            <div class="mb-4">
                <input type="email" name="email" id="email" placeholder="Почта"
                        class="mt-1 block w-full border @error('email') border-red-500 @enderror"
                        value="{{ old('email') }}">
            </div>

            <!-- Имя -->
            <div class="mb-4">
                <input type="text" name="name" id="name" placeholder="Имя"
                        class="mt-1 block w-full border @error('name') border-red-500 @enderror"
                        value="{{ old('name') }}">

                @error('name')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Фамилия -->
            <div class="mb-4">
                <input type="text" name="surname" id="surname" placeholder="Фамилия"
                        class="mt-1 block w-full border @error('surname') border-red-500 @enderror"
                        value="{{ old('surname') }}">

                @error('surname')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Пароль -->
            <div class="mb-4">
                <input type="password" name="password" id="password" placeholder="Пароль"
                        class="mt-1 block w-full border @error('password') border-red-500 @enderror">

                @error('password')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Повторите пароль -->
            <div class="mb-4">
                <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Повторите пароль"
                        class="mt-1 block w-full border @error('password_confirmation') border-red-500 @enderror">
            </div>

            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Зарегистрироваться</button>
        </form>
        <a href="{{ route('login') }}">Авторизация</a>
    </div>
</body>
</html>
