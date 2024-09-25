<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Task;
use App\Models\Backup;
use PDF;

class ExportController extends Controller
{
    public function exportStep1()
    {
        $userId = auth()->id();
        $events = Event::where('user_id', $userId)->get();
        $tasks = Task::where('user_id', $userId)->get();

        $last_backup = Backup::where('user_id', $userId)->latest()->first();

        return view('export.export-step1', compact('events', 'tasks', 'last_backup'));
    }

    public function exportStep2(Request $request)
    {
        $events = array_map('intval', (array)$request->events);
        $tasks = array_map('intval', (array)$request->tasks);
        $selectedEvents = Event::whereIn('id', $events)->get();
        $selectedTasks = Task::whereIn('id', $tasks)->get();
        $comment = $request->comment;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        return view('export.export-step2', compact('selectedEvents', 'selectedTasks', 'comment', 'startDate', 'endDate'));
    }

    public function backupData()
    {
        $userId = auth()->id();
        $events = Event::where('user_id', $userId)->get();
        $tasks = Task::where('user_id', $userId)->get();

        $backup = new Backup();
        $backup->user_id = $userId;
        $backup->data = json_encode(['events' => $events, 'tasks' => $tasks]);
        $backup->save();

        return response()->json(['message' => 'Backup created successfully.']);
    }

    public function downloadPDF(Request $request)
    {
        $events = is_string($request->events) ? json_decode($request->events, true) : (array)$request->events;
        $tasks = is_string($request->tasks) ? json_decode($request->tasks, true) : (array)$request->tasks;

        if (is_array($events) && is_array($tasks)) {
            $selectedEvents = Event::whereIn('id', $events)->get();
            $selectedTasks = Task::whereIn('id', $tasks)->get();
        } else {
            return redirect()->back()->with('error', 'Invalid data format for events or tasks');
        }

        $comment = $request->comment;
        $comment = mb_convert_encoding($comment, 'UTF-8');
        $events = mb_convert_encoding($events, 'UTF-8');
        $tasks = mb_convert_encoding($tasks, 'UTF-8');

        $pdf = PDF::loadView('export.pdf.exportPDF', compact('selectedEvents', 'selectedTasks', 'comment'))
                    ->setOptions(['defaultFont' => 'DejaVu Sans']);

        return $pdf->download('exported_data.pdf');
    }

}


