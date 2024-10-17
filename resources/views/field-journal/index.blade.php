@extends('layouts.app')

@section('content')
<div class="container my-32 mx-auto px-4">
    <h1 class="text-2xl font-bold mb-6">Полевой журнал</h1>

    <table class="table-auto w-full text-left border-collapse">
        <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 border">ID</th>
                <th class="px-4 py-2 border">ФИО</th>
                <th class="px-4 py-2 border">Время создания</th>
                <th class="px-4 py-2 border">Ряд.Куст</th>
                <th class="px-4 py-2 border">Фото куста</th>
                <th class="px-4 py-2 border">Зелёные операции</th>
                <th class="px-4 py-2 border">Операции "Почва"</th>
                <th class="px-4 py-2 border">Операции "Удобрения. Защита"</th>
                <th class="px-4 py-2 border">Комментарии</th>
            </tr>
        </thead>
        <tbody>
            @for ($i = 0; $i < 6; $i++)
            <tr>
                <td class="border px-4 py-2 field-id" data-db-id="{{ $entries[$i]->id ?? '' }}">{{ $i + 1 }}</td>
                <td class="border px-4 py-2">
                    <input type="text" class="full-name field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->full_name ?? '' }}">
                </td>
                <td class="border px-4 py-2 created-at">{{ $entries[$i]->created_at ?? '' }}</td>
                <td class="border px-4 py-2">
                    <input type="text" class="row-bush field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->row_bush ?? '' }}">
                </td>
                <td class="border px-4 py-2">
                    <input type="file" class="photo-upload border rounded w-full py-2 px-3 {{ !empty($entries[$i]->photo) ? 'hidden' : '' }}" accept="image/*">
                    <div class="photo-preview flex justify-center items-center">
                        @if (!empty($entries[$i]->photo))
                            <img src="{{ asset('storage/' . $entries[$i]->photo) }}" class="w-16 h-16 object-cover cursor-pointer">
                        @endif
                    </div>
                </td>
                <td class="border px-4 py-2">
                    <input type="text" class="green-operations field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->green_operations ?? '' }}">
                </td>
                <td class="border px-4 py-2">
                    <input type="text" class="soil-operations field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->soil_operations ?? '' }}">
                </td>
                <td class="border px-4 py-2">
                    <input type="text" class="fertilizer-operations field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->fertilizer_operations ?? '' }}">
                </td>
                <td class="border px-4 py-2">
                    <input type="text" class="comments field-input border rounded w-full py-2 px-3" value="{{ $entries[$i]->comments ?? '' }}">
                </td>
            </tr>
            @endfor
        </tbody>
    </table>
</div>

<!-- Модальное окно для увеличенного фото -->
<div id="photo-modal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center w-full h-auto">
    <div class="bg-white p-4">
        <img id="modal-photo" src="" alt="Photo" class="w-full h-[800px]">
        <button id="delete-photo-btn" class="mt-4 bg-red-500 text-white p-2">Удалить фото</button>
    </div>
</div>
@endsection
