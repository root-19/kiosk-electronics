<?php

namespace App\Http\Controllers;

use App\Models\Syllabus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SyllabusController extends Controller
{
    public function index()
    {
        $syllabi = Syllabus::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Syllabus', [
            'syllabi' => $syllabi
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'grade_level' => 'nullable|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('syllabi', $fileName, 'public');

        Syllabus::create([
            'title' => $request->title,
            'description' => $request->description,
            'subject' => $request->subject,
            'grade_level' => $request->grade_level,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return redirect()->route('syllabus.index')->with('success', 'Syllabus uploaded successfully!');
    }

    public function download($id)
    {
        $syllabus = Syllabus::findOrFail($id);
        
        if (!Storage::disk('public')->exists($syllabus->file_path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($syllabus->file_path, $syllabus->file_name);
    }

    public function destroy($id)
    {
        $syllabus = Syllabus::findOrFail($id);
        
        // Delete file from storage
        if (Storage::disk('public')->exists($syllabus->file_path)) {
            Storage::disk('public')->delete($syllabus->file_path);
        }
        
        $syllabus->delete();

        return redirect()->route('syllabus.index')->with('success', 'Syllabus deleted successfully!');
    }

    public function toggle($id)
    {
        $syllabus = Syllabus::findOrFail($id);
        $syllabus->is_active = !$syllabus->is_active;
        $syllabus->save();

        return redirect()->route('syllabus.index')->with('success', 'Syllabus status updated successfully!');
    }

    public function schoolView()
    {
        try {
            $syllabi = Syllabus::where('is_active', true)
                ->whereIn('file_type', ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                ->orderBy('created_at', 'desc')
                ->get();

            return Inertia::render('school/syllabus', [
                'syllabi' => $syllabi
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
