<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация</title>
    @vite('resources/css/app.css')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cuprum:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
</head>
<body class="h-screen" style="background: url({{ asset('img/Main_Bg_Img.svg') }}) no-repeat left center / contain fixed;">
    <div class="h-full w-1/3 mx-auto flex flex-col justify-center items-center">
        <h1 class="text-3xl font-fontProjects font-bold text-transform: uppercase mb-8 text-inputColor tracking-wider">Регистрация</h1>

        <form action="{{ route('register') }}" method="POST" class="w-2/3 flex flex-col justify-center items-center">
            @csrf
            @error('email')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
            @enderror

            <!-- Email -->
            <div class="w-full mb-8">
                <input type="email" name="email" id="email" placeholder="Почта"
                        class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('email') border-red-500 @enderror"
                        value="{{ old('email') }}">
            </div>

            <!-- ФИО -->
            <div class="w-full mb-8 flex justify-between">
                <!-- Имя -->
                <div class="w-[194px]">
                    <input type="text" name="name" id="name" placeholder="Имя"
                            class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('name') border-red-500 @enderror"
                            value="{{ old('name') }}">

                    @error('name')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Фамилия -->
                <div class="w-[194px]">
                    <input type="text" name="surname" id="surname" placeholder="Фамилия"
                            class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('surname') border-red-500 @enderror"
                            value="{{ old('surname') }}">

                    @error('surname')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>    

            <!-- Пароль -->
            <div class="w-full mb-8">
                <input type="password" name="password" id="password" placeholder="Пароль"
                        class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('password') border-red-500 @enderror">

                @error('password')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Повторите пароль -->
            <div class="w-full mb-8">
                <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Повторите пароль"
                        class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('password_confirmation') border-red-500 @enderror">
            </div>

            <a class="font-fontProjects text-xl tracking-wide" href="{{ route('login') }}">Авторизация</a>

            <button type="submit" class="bg-none font-fontProjects font-bold text-3xl text-black text-transform: uppercase mt-8">Зарегистрироваться</button>
        </form>
    </div>
</body>
</html>
