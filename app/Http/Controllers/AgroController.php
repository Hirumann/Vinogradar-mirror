<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Task;
use App\Models\AgroPlanOperationRef;
use Illuminate\Http\Request;

class AgroController extends Controller
{
    // Страница Агроплана
    public function agroplan()
    {
        $svgIconMiniCalendar = file_get_contents(public_path('svg/mini_calendar_icon.svg'));
        $svgIconBucket = file_get_contents(public_path('svg/bucket_icon.svg'));
        return view('agroplan.agroplan', [
            'iconMiniCalendar' => $svgIconMiniCalendar,
            'iconBucket' => $svgIconBucket,
        ]);
    }

    public function getDayData(Request $request)
    {
        $date = date('Y-m-d', strtotime($request->input('start_date')));

        $events = Event::where('start_date', '<=', $date)
                        ->where('end_date', '>=', $date)
                        ->where('user_id', auth()->id()) // Учет пользователя
                        ->get();

        $tasks = Task::where('start_date', '<=', $date)
                        ->where('end_date', '>=', $date)
                        ->where('user_id', auth()->id()) // Учет пользователя
                        ->get();

        $direct = AgroPlanOperationRef::where('start_date', '<=', $date)
                        ->where('end_date', '>=', $date)
                        ->get();

        return response()->json([
            'events' => $events,
            'tasks' => $tasks,
            'direct' => $direct,
        ]);
    }

    public function getCalendarData($year, $month)
    {
        $events = Event::where('user_id', auth()->id())  // Фильтруем по user_id
            ->where(function ($query) use ($year, $month) {
                $query->whereYear('start_date', $year)
                    ->orWhereYear('end_date', $year)
                    ->whereMonth('start_date', $month)
                    ->orWhereMonth('end_date', $month);
            })->get();

        $tasks = Task::where('user_id', auth()->id())  // Фильтруем по user_id
            ->where(function ($query) use ($year, $month) {
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
                'user_id' => auth()->id(), // Привязка к пользователю
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
                'user_id' => auth()->id(), // Привязка к пользователю
            ]);
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true]);
    }

    public function addDirect(Request $request)
    {
        $operations = $request->input('selectedRows'); 
        $startDate = $request->input('start_date'); 
        $endDate = $request->input('end_date'); 

        if (!empty($operations) && !empty($startDate)) {
            foreach ($operations as $operation) {
                AgroPlanOperationRef::create([
                    'name' => $operation['name'],
                    'reference_table' => $operation['tableName'],
                    'reference_row_id' => $operation['rowId'],  // Имя таблицы справочника
                    'start_date' => date('Y-m-d', strtotime($startDate)),
                    'end_date' => date('Y-m-d', strtotime($endDate)),
                ]);
            }
        } else {
            return response()->json(['error' => 'No data provided'], 400);
        }

        return response()->json(['success' => true]);
    }

    public function deleteEvent($id)
    {
        $event = Event::where('id', $id)
                  ->where('user_id', auth()->id()) // Только события текущего пользователя
                  ->first();

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['success' => true]);
    }

    public function deleteTask($id)
    {
        $task = Task::where('id', $id)
                  ->where('user_id', auth()->id()) // Только события текущего пользователя
                  ->first();

        if (!$task) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $task->delete();

        return response()->json(['success' => true]);
    }

    public function deleteDirect($id)
    {
        $direct = AgroPlanOperationRef::where('id', $id)
                  ->first();

        if (!$direct) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $direct->delete();

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

    public function setDirectRange(Request $request, $id)
    {
        $direct = AgroPlanOperationRef::findOrFail($id);

        $data = $request->validate([
            'start_date' => ['required','date'],
            'end_date' => ['required','date'],
        ]);

        if (!empty($data)) {
                $direct->start_date = date('Y-m-d', strtotime($data['start_date']));
                $direct->end_date = date('Y-m-d', strtotime($data['end_date']));
                $direct->save();
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

    public function getDirectRange($id)
    {
        
        $item = AgroPlanOperationRef::find($id);

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
        $events = Event::where('user_id', auth()->id())->get(); // Учитываем пользователя
        $tasks = Task::where('user_id', auth()->id())->get(); // Учитываем пользователя

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
