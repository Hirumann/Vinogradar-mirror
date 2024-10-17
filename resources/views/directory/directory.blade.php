@extends('layouts.app')

@section('content')
<div class="flex h-[600px] w-full my-32">
    <!-- Боковое меню для переключения таблиц -->
    <div class="w-1/5 flex flex-col justify-start items-center">
      <button class="table-btn active" data-table="phenophases">Фенофазы</button>
      <button class="table-btn" data-table="agro_operations">Агрооперации</button>
      <button class="table-btn" data-table="meteodatas">Метеоданные</button>
      <button class="table-btn" data-table="climatic_parametres">Климатические параметры</button>
      <button class="table-btn" data-table="plotdatas">Данные по участку</button>
      <button class="table-btn" data-table="sorts">Сорта</button>
      <button class="table-btn" data-table="sicks">Болезни</button>
      <button class="table-btn" data-table="people">Люди</button>
      <button class="table-btn" data-table="func_needs">Функциональные обязанности</button>
      <button class="table-btn" data-table="green_defends">Защита растений</button>
      <!-- Кнопки для остальных таблиц -->
    </div>
  
    <!-- Область для таблицы -->
    <div class="w-4/5">
      <div id="table-container">
        <table class="max-w-[90%]">
            <thead>
                <tr id="phenophases-table-thead">
                    
                </tr>
            </thead>
            <tbody id="phenophases-table-body">
                <!-- Строки будут загружаться через JS -->
            </tbody>
        </table>
      </div>
  
      <!-- Общие кнопки -->
      <button id="add-row-btn">Добавить строку</button>
    </div>

    <input type="text" id="start-date-direct" class="border p-2 w-full hidden" readonly>
    <input type="text" id="end-date-direct" class="border p-2 w-full hidden" readonly>
    <div id="range-modal" class="hidden fixed inset-0 backdrop-blur-sm justify-center items-center">
        <div class="bg-[#00CC66] flex justify-between items-center">
            <div>
                <div id="date-ranges-list" class="mb-4">
                    <!-- Динамически подгружаемые даты будут сюда вставляться -->
                </div>
                <button id="add-date-range" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Date Range
                </button>
            </div>
            <div id="mini-calendar-container" class="w-[660px] bg-white px-4 pb-4 rounded-[32px] border border-black hidden flex-col items-center">
                <h2>Выберите диапазон</h2>
                <div class="flex justify-between items-center mb-4">
                    <button id="prev-month-calendar" class="w-[32px] h-[32px]">
                        {!! file_get_contents(public_path('svg/left_arrow.svg')) !!}
                    </button>
                    <h2 id="current-month-calendar" class="text-[30px] font-bold uppercase mx-4">Октябрь 2024</h2>
                    <button id="next-month-calendar" class="w-[32px] h-[32px]">
                        {!! file_get_contents(public_path('svg/right_arrow.svg')) !!}
                    </button>
                </div>
                <div class="grid grid-cols-7 gap-2 text-center w-2/3">
                    <div>ПН</div>
                    <div>ВТ</div>
                    <div>СР</div>
                    <div>ЧТ</div>
                    <div>ПТ</div>
                    <div>СБ</div>
                    <div>ВС</div>
                </div>
                <div id="mini-calendar" class="grid grid-cols-7 gap-2 text-center w-2/3"></div>
            </div>
        </div>
    </div>

    <div id="modal-agro-operations" class="fixed inset-0 backdrop-blur-sm hidden justify-center items-center">
        <div class="modal-content">
            <h3>Агротехнические мероприятия</h3>
            <ul id="agro-operations-list">
                <!-- Список мероприятий будет отображаться здесь -->
            </ul>
            <button id="add-operation-btn">Добавить мероприятие</button>
            <button id="close-modal-btn">Закрыть</button>
        </div>
    </div>
    <div id="storage" data-storage="{{ asset('storage/') }}"></div>
</div>
@endsection