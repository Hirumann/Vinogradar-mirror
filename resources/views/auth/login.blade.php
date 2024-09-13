<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Логин</title>
    @vite('resources/css/app.css')
</head>
<body class="h-screen">
    <div class="h-full w-1/3 mx-auto flex flex-col justify-center items-center">
        <h1 class="text-xl font-bold mb-4">Войти</h1>

        <form action="{{ route('login') }}" method="POST" class="flex flex-col justify-center items-center">
            @csrf

            <!-- Email -->
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium">Email</label>
                <input type="email" name="email" id="email" placeholder="Почта"
                       class="mt-1 block w-full border @error('email') border-red-500 @enderror"
                       value="{{ old('email') }}">

                @error('email')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Пароль -->
            <div class="mb-4">
                <label for="password" class="block text-sm font-medium">Пароль</label>
                <input type="password" name="password" id="password" placeholder="Пароль"
                       class="mt-1 block w-full border @error('password') border-red-500 @enderror">

                @error('password')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Войти</button>
        </form>
        <a href="{{ route('register') }}">Регистрация</a>
    </div>
</body>
</html>
