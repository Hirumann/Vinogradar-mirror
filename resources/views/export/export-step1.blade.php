@extends('layouts.app')

@section('content')
<input type="text" id="start-date-export" class="border p-2 w-full hidden" readonly>
<input type="text" id="end-date-export" class="border p-2 w-full hidden" readonly>
<div id="content" class="flex justify-center items-center">
    <div class="w-[660px] bg-white px-4 pb-4 rounded-[32px] border border-black flex flex-col items-center">
        <div class="flex justify-between items-center mb-4">
            <button id="prev-month-export" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/left_arrow.svg')) !!}</button>
            <h2 id="current-month-export" class="text-[30px] font-bold uppercase mx-4">Сентябрь 2024</h2>
            <button id="next-month-export" class="w-[32px] h-[32px]">{!! file_get_contents(public_path('svg/right_arrow.svg')) !!}</button>
        </div>
        <div class="w-full grid grid-cols-7 gap-2 text-center">
            <div class="text-[20px] font-extrabold">ПН</div>
            <div class="text-[20px] font-extrabold">ВТ</div>
            <div class="text-[20px] font-extrabold">СР</div>
            <div class="text-[20px] font-extrabold">ЧТ</div>
            <div class="text-[20px] font-extrabold">ПТ</div>
            <div class="text-[20px] text-[#9886B1] font-extrabold">СБ</div>
            <div class="text-[20px] text-[#9886B1] font-extrabold">ВС</div>
        </div>
        <div id="mini-calendar-export" class="w-full grid grid-cols-7 gap-2 text-center">
            
        </div>
    </div>

    <div>
        <h4>Select Events</h4>
        <select id="events-select" multiple>
            @foreach ($events as $event)
                <option value="{{ $event->id }}">{{ $event->name }} ({{ $event->start_date }} - {{ $event->end_date }})</option>
            @endforeach
        </select>
    </div>

    <div>
        <h4>Select Tasks</h4>
        <select id="tasks-select" multiple>
            @foreach ($tasks as $task)
                <option value="{{ $task->id }}">{{ $task->name }} ({{ $task->start_date }} - {{ $task->end_date }})</option>
            @endforeach
        </select>
    </div>

    <div>
        <h4>Add a Comment</h4>
        <textarea id="comment" placeholder="Add your comment"></textarea>
    </div>

    <button id="next-btn">Next</button>

    <button id="backup-btn">Backup Data</button>
    <p>Last Backup: {{ $last_backup ? $last_backup->created_at : 'No backups yet' }}</p>
</div>
@endsection