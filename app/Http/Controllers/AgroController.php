<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Task;
use Illuminate\Http\Request;

class AgroController extends Controller
{
    // Страница Агроплана
    public function agroplan()
    {
        return view('agroplan.agroplan');
    }

    public function getDayData(Request $request)
    {
        $date = date('Y-m-d', strtotime($request->input('start_date')));
        
        $events = Event::where('start_date', '<=', $date)
                        ->where('end_date', '>=', $date)
                        ->get();

        $tasks = Task::where('start_date', '<=', $date)
                        ->where('end_date', '>=', $date)
                        ->get();

        return response()->json([
            'events' => $events,
            'tasks' => $tasks,
        ]);
    }

    public function getCalendarData($year, $month)
    {
        $events = Event::where(function ($query) use ($year, $month) {
            $query->whereYear('start_date', $year)
                  ->orWhereYear('end_date', $year)
                  ->whereMonth('start_date', $month)
                  ->orWhereMonth('end_date', $month);
        })->get();

        $tasks = Task::where(function ($query) use ($year, $month) {
            $query->whereYear('start_date', $year)
                  ->orWhereYear('end_date', $year)
                  ->whereMonth('start_date', $month)
                  ->orWhereMonth('end_date', $month);
        })->get();

        return response()->json([
            'events' => $events,
            'tasks' => $tasks
        ]);
    }

    public function addEvent(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'start_date' => ['required','date'],
            'end_date' => ['date'],
        ]);
        
        if (!empty($data)) {
            $event = Event::create([
                'name' => $data['name'],
                'start_date' => date('Y-m-d', strtotime($data['start_date'])),
                'end_date' => date('Y-m-d', strtotime($data['end_date'])),
            ]);
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true]);
    }

    public function addTask(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
        ]);

        if (!empty($data)) {
            $task = Task::create([
                'name' => $data['name'],
                'start_date' => date('Y-m-d', strtotime($data['start_date'])),
                'end_date' => date('Y-m-d', strtotime($data['end_date'])),
            ]);
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true]);
    }

    public function deleteEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['success' => true]);
    }

    public function deleteTask($id)
    {
        Task::destroy($id);

        return response()->json(['success' => true]);
    }

    public function setEventRange(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $data = $request->validate([
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
        ]);

        if (!empty($data)) {
                $event->start_date = date('Y-m-d', strtotime($data['start_date']));
                $event->end_date = date('Y-m-d', strtotime($data['end_date']));
                $event->save();
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true, 'message' => 'Диапазон события обновлен']);
    }

    public function setTaskRange(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $data = $request->validate([
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
        ]);

        if (!empty($data)) {
                $task->start_date = date('Y-m-d', strtotime($data['start_date']));
                $task->end_date = date('Y-m-d', strtotime($data['end_date']));
                $task->save();
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true, 'message' => 'Диапазон плановой работы обновлен']);
    }

    public function getEventRange($id)
    {
        
        $item = Event::find($id);

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json([
            'start_date' => $item->start_date,
            'end_date' => $item->end_date
        ]);
    }

    public function getTaskRange($id)
    {
        
        $item = Task::find($id);

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json([
            'start_date' => $item->start_date,
            'end_date' => $item->end_date
        ]);
    }

    public function getGanttData(Request $request)
    {
        $precision = $request->input('precision', 'week');
        $events = Event::all();
        $tasks = Task::all();

        $ganttData = $this->prepareGanttData($events, $tasks, $precision);

        return response()->json(['data' => $ganttData]);
    }

    private function prepareGanttData($events, $tasks, $precision)
    {
        $ganttData = [];

        foreach ($events as $event) {
            $ganttData[] = [
                'name' => $event->name,
                'start_date' => $event->start_date,
                'end_date' => $event->end_date,
            ];
        }

        foreach ($tasks as $task) {
            $ganttData[] = [
                'name' => $task->name,
                'start_date' => $task->start_date,
                'end_date' => $task->end_date,
            ];
        }

        // Возможно, ты захочешь изменить структуру данных, в зависимости от precision

        return $ganttData;
    }
}
