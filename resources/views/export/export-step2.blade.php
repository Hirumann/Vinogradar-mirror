<div class="my-32 mx-auto">
    <h3>Export Data - Step 2</h3>

    <h4>Selected Date Range: {{ $startDate }} to {{ $endDate }}</h4>

    <h4>Selected Events:</h4>
    <ul>
        @foreach ($selectedEvents as $event)
            <li>{{ $event->name }} ({{ $event->start_date }} - {{ $event->end_date }})</li>
        @endforeach
    </ul>

    <h4>Selected Tasks:</h4>
    <ul>
        @foreach ($selectedTasks as $task)
            <li>{{ $task->name }} ({{ $task->start_date }} - {{ $task->end_date }})</li>
        @endforeach
    </ul>

    <h4>Comment:</h4>
    <p>{{ $comment }}</p>

    <form action="{{ route('export.download.pdf') }}" method="POST">
        @csrf
        <input type="hidden" name="events" value="{{ json_encode($selectedEvents->pluck('id')->toArray()) }}">
        <input type="hidden" name="tasks" value="{{ json_encode($selectedTasks->pluck('id')->toArray()) }}">
        <input type="hidden" name="comment" value="{{ $comment }}">
        <button type="submit">Download PDF</button>
    </form>

    <button id="back-btn">Back</button>
</div>

