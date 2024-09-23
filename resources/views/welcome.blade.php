<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Приветствие</title>
    @vite('resources/css/app.css')
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cuprum:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
</head>
<body style="background: url({{ Vite::asset('resources/img/Bg_Img.svg') }}) no-repeat left center / contain fixed;">
    <div class="flex flex-row-reverse mt-10 mr-20">
        <a class="w-48 h-16 bg-[#4b4b4b] rounded-full flex justify-center items-center text-xl text-white font-bold border-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-neutral-800 duration-300" 
        href="{{ route('login') }}"> <img class="mr-4" src="{{ Vite::asset('resources/img/Icon_Acc.svg') }}" alt="Icon_Acc">войти
        </a>
    </div>
    <div class="w-full flex mx-auto">
        <div class="w-2/5 ml-24">
            <img class="max-w-720 max-h-793" src="{{ Vite::asset('resources/img/Vino_Logo.svg') }}" alt="Logo">
        </div>
        <div class="flex flex-col justify-evenly font-bold font-fontProjects w-1/2">
            <h1 class="w-full text-[150px] leading-[180px]">Цифровой Виноградник</h1>
            <div class="w-full columns-2 text-6xl flex flex-wrap gap-y-8">
                <span class="w-1/2 flex items-center"><img class="w-20 h-20 mr-2" src="{{ Vite::asset('resources/img/Icon_History.svg') }}" alt="Icon_History">история поля</span>
                <span class="w-1/2 flex items-center"><img class="w-20 h-20 mr-2" src="{{ Vite::asset('resources/img/Icon_Journal.svg') }}" alt="Icon_Journal">агрожурнал</span>
                <span class="w-1/2 flex items-center"><img class="w-20 h-20 mr-2" src="{{ Vite::asset('resources/img/Icon_Weather.svg') }}" alt="Icon_Weather">погода</span>
                <span class="w-1/2 flex items-center"><img class="w-20 h-20 mr-2" src="{{ Vite::asset('resources/img/Icon_Recomendation.svg') }}" alt="Icon_Recomendation">рекомендации</span>
            </div>
        </div>
    </div>
</body>
</html>
