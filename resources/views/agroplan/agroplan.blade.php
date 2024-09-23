@extends('layouts.app')

@section('content')
    <script>
        window.calendarIcon = `{!! file_get_contents(public_path('svg/calendar_icon.svg')) !!}`;
        window.bucketIcon = `{!! file_get_contents(public_path('svg/bucket_icon.svg')) !!}`;
    </script>
    <div class="h-full w-full flex flex-col items-end">
        <h1 class="text-8xl mr-10">
            Агроплан
        </h1>
                      <div class="h-full w-full flex justify-center items-center">
            <!-- Button to download data -->
            <div class="h-[767px] w-1/5 flex flex-col justify-between items-center ml-10 mr-10">
                <button class="w-[271px] h-[59px] mt-16 bg-[#00CC66] rounded-[20px] text-black text-2xl uppercase shadow-main hover:bg-[#00BB55] active:bg-[#11DD77] transition duration-75 ease-in-out">Выгрузить данные</button>
                <div class="w-full flex justify-around items-end">
                    <button id="calendar-view" class="bg-[#00CC66] text-black px-4 py-2 rounded-[20px] transition ease-in-out uppercase text-[20px]">{!! file_get_contents(public_path('svg/calendar_icon.svg')) !!}Календарь</button>
                    <button id="gantt-view" class="bg-transparent hover:bg-[#00CC66AA] text-black px-4 py-2 rounded-[20px] transition ease-in-out uppercase text-[20px]">{!! file_get_contents(public_path('svg/gantt_icon.svg')) !!}Диаграмма</button>
                </div>
            </div>
    
            <div class="w-[1435px] mr-10 h-[767px]" id="calendar">
                <div class="flex justify-center items-center mb-4">
                    <button id="prev-month" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/left_arrow.svg')) !!}</button>
                    <h2 id="current-month" class="text-[30px] uppercase mx-20">Сентябрь 2024</h2>
                    <button id="next-month" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/right_arrow.svg')) !!}</button>
                </div>
                <div class="grid grid-cols-7 text-center">
                    <!-- Static days of Week -->
                    <div class="w-[203px] h-[61px] bg-black text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Понедельник</div>
                    <div class="w-[203px] h-[61px] bg-black text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Вторник</div>
                    <div class="w-[203px] h-[61px] bg-black text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Среда</div>
                    <div class="w-[203px] h-[61px] bg-black text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Четверг</div>
                    <div class="w-[203px] h-[61px] bg-black text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Пятница</div>
                    <div class="w-[203px] h-[61px] bg-red-600 text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Суббота</div>
                    <div class="w-[203px] h-[61px] bg-red-600 text-white text-[20px] uppercase border-2 border-white flex justify-center items-center">Воскресенье</div>
                </div>
                <!-- Dynamic days of month -->
                <div id="calendar-grid" class="w-full h-[650px] grid grid-cols-7"></div>
            </div>
            
            <div id="gantt" class="hidden w-[1435px] mt-20 mr-10 h-[767px] bg-[#00CC66]">
                <div class="flex justify-evenly items-center my-4">
                    <button id="view-day" class="view-button bg-transparent font-bold text-black text-[20px] px-4 py-2 uppercase">День</button>
                    <button id="view-week" class="view-button bg-transparent font-bold text-white text-[20px] px-4 py-2 uppercase">Неделя</button>
                    <button id="view-month" class="view-button bg-transparent font-bold text-black text-[20px] px-4 py-2 uppercase">Месяц</button>
                    <button id="view-quarter" class="view-button bg-transparent font-bold text-black text-[20px] px-4 py-2 uppercase">Квартал</button>
                    <button id="view-year" class="view-button bg-transparent font-bold text-black text-[20px] px-4 py-2 uppercase">Год</button>
                </div>
            
                <div class="overflow-scroll max-h-[80%]">
                    <table class="min-w-[94%] min-h-[80%] table-auto bg-white mx-10">
                        <thead>
                            <tr id="dynamic-columns">
                                <th class="border px-2 py-2">№</th>
                                <th class="border px-2 py-2">Название</th>
                                <th class="border px-2 py-2">Длительность (дни)</th>
                                <th class="border px-2 py-2">Начало</th>
                                <th class="border px-2 py-2">Конец</th>
                                <!-- Тут будут динамические столбцы -->
                            </tr>
                        </thead>
                        <tbody id="gantt-table-body">
                            <!-- Здесь будет отрисована таблица -->
                        </tbody>
                    </table>
                </div>
            </div>
    
            <!-- Modal (hidden) -->
            <div id="modal" class="fixed inset-0 backdrop-blur-sm hidden justify-center items-center">
                <div id="modal-content" class="w-72 h-[570px] flex flex-col justify-start items-center bg-[#80E5B3] px-6 py-2 rounded-lg shadow-lg max-w-xl mt-20 relative">
                    <h2 id="modal-date" class="hidden"></h2>
                    <h3 class="font-semibold mb-2 text-[11px]">события</h3>
                    <div id="modal-events" class="max-h-32 w-full overflow-y-scroll">
                        
                        <ul id="event-list" class="w-full"></ul>
                    </div>
                    <button id="add-event" class="w-[25px] h-[25px] pb-[3px] mb-4 bg-[#00CC6680] rounded-full text-black font-bold text-[20px] leading-none">+</button>
                    <h3 class="font-semibold mb-2 text-[11px]">плановые работы</h3>
                    <div id="modal-tasks" class="max-h-32 w-full overflow-y-scroll">
                        
                        <ul id="task-list" class="w-full"></ul>
                    </div>
                    <button id="add-task" class="w-[25px] h-[25px] pb-[3px] mb-4 bg-[#00CC6680] rounded-full text-black font-bold text-[20px] leading-none">+</button>
                </div>
            </div>

            <div id="event-modal" class="hidden fixed inset-0 items-center justify-center bg-transparent z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-lg font-semibold mb-4">Введите название:</h2>
                    <input type="text" id="event-name-input" class="border border-gray-300 p-2 rounded-lg w-full" placeholder="Название">
                </div>
            </div>

            <div id="task-modal" class="hidden fixed inset-0 items-center justify-center bg-transparent z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-lg font-semibold mb-4">Введите название:</h2>
                    <input type="text" id="task-name-input" class="border border-gray-300 p-2 rounded-lg w-full" placeholder="Название">
                </div>
            </div>
    
            <input type="text" id="start-date" class="border p-2 w-full hidden" readonly>
            <input type="text" id="end-date" class="border p-2 w-full hidden" readonly>
            <!-- Range modal (hidden) -->
            <div id="range-modal" class="hidden fixed inset-0 backdrop-blur-sm justify-center items-center">
                <div class="w-[660px] bg-white px-4 pb-4 rounded-[32px] border border-black flex flex-col items-center">
                    <h2 class="text-red-600">выберите диапазон</h2>
                    <div class="flex justify-between items-center mb-4">
                        <button id="prev-month-calendar" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/left_arrow.svg')) !!}</button>
                        <h2 id="current-month-calendar" class="text-[30px] font-bold uppercase mx-4">Сентябрь 2024</h2>
                        <button id="next-month-calendar" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/right_arrow.svg')) !!}</button>
                    </div>
                    <div class="w-full grid grid-cols-7 gap-2 text-center">
                        <!-- Static days of Week -->
                        <div class="text-[20px] font-extrabold">ПН</div>
                        <div class="text-[20px] font-extrabold">ВТ</div>
                        <div class="text-[20px] font-extrabold">СР</div>
                        <div class="text-[20px] font-extrabold">ЧТ</div>
                        <div class="text-[20px] font-extrabold">ПТ</div>
                        <div class="text-[20px] text-[#9886B1] font-extrabold">СБ</div>
                        <div class="text-[20px] text-[#9886B1] font-extrabold">ВС</div>
                    </div>
                    <div id="mini-calendar" class="w-full grid grid-cols-7 gap-2 text-center">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection