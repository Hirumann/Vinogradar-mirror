@extends('layouts.app')

@section('content')
    <div class="flex flex-col justify-start h-[650px] w-full mx-10 p-10 rounded-[138px] shadow-[0px_14px_34.1px_0px_#00000040;] text-center">
        <h1 class="text-[96px] font-bold uppercase">Контакты</h1>
        <div class="h-full flex justify-between items-center -translate-y-32">
            <img src="{{ asset('img/logo_transparent.png') }}" alt="Logo" class="-translate-x-10 transition-all duration-200 ease-in-out hover:rotate-12">
            <div class="flex flex-col justify-between items-center text-[64px] mr-32">
                <a href="#" target="_blank" class="relative animated-link">+7 (978) 000-00-00</a>
                <a href="#" target="_blank" class="relative animated-link">@smartvineyard</a>
                <a href="#" target="_blank" class="relative animated-link">mail@yandex.ru</a>
            </div>
        </div>
    </div>
@endsection