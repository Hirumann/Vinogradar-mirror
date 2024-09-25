<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Data</title>
</head>
<body>
    <h1>Exported Data</h1>
    <h3>Events</h3>
    <ul>
        @foreach ($selectedEvents as $event)
            <li>{{ $event->name }} ({{ $event->start_date }} - {{ $event->end_date }})</li>
        @endforeach
    </ul>

    <h3>Tasks</h3>
    <ul>
        @foreach ($selectedTasks as $task)
            <li>{{ $task->name }} ({{ $task->start_date }} - {{ $task->end_date }})</li>
        @endforeach
    </ul>

    <h3>Comment:</h3>
    <p>{{ $comment }}</p>
</body>
</html>
