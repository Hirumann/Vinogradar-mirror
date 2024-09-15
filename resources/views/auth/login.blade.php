<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Логин</title>
    @vite('resources/css/app.css')
</head>
<body class="h-screen" style="background: url({{ Vite::asset('resources/img/Main_Bg_Img.svg') }}) no-repeat left center / contain fixed;">
    <div class="h-full w-1/3 mx-auto flex flex-col justify-center items-center">
        <img class="mx-auto" src="{{ Vite::asset('resources/img/Icon_Login_Screen.svg') }}" alt="Icon_Login_Screen">
        <h1 class="text-xl text-transform: uppercase font-bold font-fontProjects text-[#00CC66] mb-5 mt-10">войдите в учётную запись</h1>

        <form action="{{ route('login') }}" method="POST" class="w-2/3 flex flex-col justify-center items-center">
            @csrf

            <!-- Email -->
            <div class="w-full mb-6 font-fontProjects text-xl">
                <input  type="email" name="email" id="email" placeholder="Email"
                       class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('email') border-red-500 @enderror"
                       value="{{ old('email') }}">

                @error('email')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <!-- Пароль -->
            <div class="w-full mb-6 font-fontProjects text-xl">
                <input type="password" name="password" id="password" placeholder="Пароль"
                       class="h-16 pl-4 bg-inputColor/50 placeholder:font-fontProjects placeholder:text-black placeholder:text-xl mt-1 block w-full border @error('password') border-red-500 @enderror">

                @error('password')
                    <span class="text-red-500 text-sm">{{ $message }}</span>
                @enderror
            </div>

            <a class="font-fontProjects text-xl my-4" href="{{ route('register') }}">Регистрация</a>

            <button type="submit" class="bg-none font-fontProjects font-bold text-3xl text-black text-transform: uppercase mt-7">Войти</button>

        </form>
    </div>
</body>
</html>
