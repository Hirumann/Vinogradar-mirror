@extends('layouts.app')

@section('content')
    <div class="w-full flex flex-col justify-center items-center">
        <!-- Button to download data -->
        <div class="w-2/3 flex justify-between items-center mb-4">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-lg">Выгрузить данные</button>
            <div>
                <button id="calendar-view" class="bg-blue-500 text-white px-4 py-2 rounded-l-lg">Календарь</button>
                <button id="gantt-view" class="bg-gray-500 text-white px-4 py-2 rounded-r-lg">Диаграмма Ганта</button>
            </div>
        </div>

        <div class="w-2/3" id="calendar">
            <div class="flex justify-between items-center mb-4">
                <button id="prev-month" class="text-gray-500">← Предыдущий месяц</button>
                <h2 id="current-month" class="text-xl font-semibold">Сентябрь 2024</h2>
                <button id="next-month" class="text-gray-500">Следующий месяц →</button>
            </div>
            <div class="grid grid-cols-7 gap-2 text-center">
                <!-- Static days of Week -->
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <!-- Dynamic days of month -->
            <div id="calendar-grid" class="grid grid-cols-7 gap-2"></div>
        </div>
        
        <div id="gantt" class="hidden w-2/3">
            <div class="flex justify-evenly items-center mb-4">
                <button id="view-day" class="view-button bg-gray-500 text-white px-4 py-2">День</button>
                <button id="view-week" class="view-button bg-blue-500 text-white px-4 py-2">Неделя</button>
                <button id="view-month" class="view-button bg-gray-500 text-white px-4 py-2">Месяц</button>
                <button id="view-quarter" class="view-button bg-gray-500 text-white px-4 py-2">Квартал</button>
                <button id="view-year" class="view-button bg-gray-500 text-white px-4 py-2">Год</button>
            </div>
        
            <table class="min-w-full table-auto">
                <thead>
                    <tr id="dynamic-columns">
                        <th class="border px-4 py-2">№</th>
                        <th class="border px-4 py-2">Название</th>
                        <th class="border px-4 py-2">Длительность (дни)</th>
                        <th class="border px-4 py-2">Начало</th>
                        <th class="border px-4 py-2">Конец</th>
                        <!-- Тут будут динамические столбцы -->
                    </tr>
                </thead>
                <tbody id="gantt-table-body">
                    <!-- Здесь будет отрисована таблица -->
                </tbody>
            </table>
        </div>

        <!-- Modal (hidden) -->
        <div id="modal" class="fixed inset-0 bg-gray-800 bg-opacity-50 hidden flex justify-center items-center">
            <div id="modal-content" class="w-72 h-[570px] bg-white p-6 rounded-lg shadow-lg max-w-xl mt-20 relative">
                <h2 id="modal-date" class="text-xl font-bold mb-4"></h2>
                <h3 class="font-semibold mb-2">События:</h3>
                <div id="modal-events" class="max-h-20 overflow-scroll">
                    
                    <ul id="event-list"></ul>
                </div>
                <button id="add-event" class="bg-green-500 text-white px-4 py-2 mt-2 mb-4">Добавить событие</button>
        
                <h3 class="font-semibold mb-2">Плановые работы:</h3>
                <div id="modal-tasks" class="max-h-20 overflow-scroll">
                    
                    <ul id="task-list"></ul>
                </div>
                <button id="add-task" class="bg-green-500 text-white px-4 py-2 mt-2 mb-4">Добавить плановые работы</button>
            </div>
        </div>

        <input type="text" id="start-date" class="border p-2 w-full hidden" readonly>
        <input type="text" id="end-date" class="border p-2 w-full hidden" readonly>
        <!-- Range modal (hidden) -->
        <div id="range-modal" class="hidden fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white p-4 rounded-lg">
                <h2 class="text-lg font-semibold mb-4">Выбор диапазона</h2>
                <div class="flex justify-between items-center mb-4">
                    <button id="prev-month-calendar" class="text-gray-500">← Предыдущий месяц</button>
                    <h2 id="current-month-calendar" class="text-xl font-semibold">Сентябрь 2024</h2>
                    <button id="next-month-calendar" class="text-gray-500">Следующий месяц →</button>
                </div>
                <div class="grid grid-cols-7 gap-2 text-center">
                    <!-- Static days of Week -->
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
                </div>
                <div id="mini-calendar" class="grid grid-cols-7 gap-2 text-center">
                    
                </div>
            </div>
        </div>
    </div>
@endsection