<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FieldJournalEntry;
use Illuminate\Support\Facades\Storage;

class FieldJournalController extends Controller
{
    public function index()
    {
        $entries = FieldJournalEntry::all();
        return view('field-journal.index', compact('entries'));
    }

    public function create(Request $request)
    {
        $entry = new FieldJournalEntry();

        $entry->full_name = $request->input('full_name');
        $entry->row_bush = $request->input('row_bush');
        $entry->green_operations = $request->input('green_operations');
        $entry->soil_operations = $request->input('soil_operations');
        $entry->fertilizer_operations = $request->input('fertilizer_operations');
        $entry->comments = $request->input('comments');
        $entry->save();

        return response()->json(['id' => $entry->id, 'created_at' => $entry->created_at, 'message' => 'Новая запись создана']);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'row_bush' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'green_operations' => 'nullable|string',
            'soil_operations' => 'nullable|string',
            'fertilizer_operations' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('journal_photos', 'public');
        }

        FieldJournalEntry::create($validated);

        return response()->json(['success' => 'Entry added successfully.']);
    }

    public function update(Request $request, $id)
    {
        $entry = FieldJournalEntry::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'row_bush' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'green_operations' => 'nullable|string',
            'soil_operations' => 'nullable|string',
            'fertilizer_operations' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($entry->photo) {
                Storage::disk('public')->delete($entry->photo);
            }
            $validated['photo'] = $request->file('photo')->store('journal_photos', 'public');
        }

        $entry->update($validated);

        return response()->json(['success' => 'Entry updated successfully.']);
    }

    public function destroy($id)
    {
        $entry = FieldJournalEntry::find($id);

        if ($entry) {
            if (!empty($entry->photo)) {
                Storage::delete('public/' . $entry->photo);
            }
    
            $entry->delete();
    
            return response()->json(['message' => 'Запись успешно удалена']);
        }
    
        return response()->json(['message' => 'Запись не найдена'], 404);
    }

    public function uploadPhoto(Request $request, $id)
    {
        $entry = FieldJournalEntry::find($id);

        if ($request->hasFile('photo')) {
            // Удаляем старое фото, если оно существует
            if ($entry->photo) {
                Storage::delete('public/' . $entry->photo);
            }

            // Сохраняем новое фото
            $path = $request->file('photo')->store('photos', 'public');
            $entry->photo = $path;
            $entry->save();

            return response()->json(['photo' => asset('storage/' . $path)]);
        }

        return response()->json(['error' => 'Файл не загружен'], 400);
    }

    public function deletePhoto($id)
    {
        $entry = FieldJournalEntry::find($id);
        if ($entry && $entry->photo) {
            // Удаляем файл фото
            Storage::delete('public/' . $entry->photo);
            $entry->photo = null;
            $entry->save();

            return response()->json(['message' => 'Фото удалено']);
        }

        return response()->json(['error' => 'Фото не найдено'], 404);
    }
}
