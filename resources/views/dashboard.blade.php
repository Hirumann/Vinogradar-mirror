@extends('layouts.app')

@section('title', 'Личный кабинет')

@section('content')
    <h1>Добро пожаловать, {{ Auth::user()->name }}!</h1>
    <!-- Тут будет основной функционал личного кабинета -->
@endsection
