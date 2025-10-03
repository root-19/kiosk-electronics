<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\GradeViewer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeViewerController extends Controller
{
    // Admin: manage + edit grades
    public function index()
    {
        $grades = GradeViewer::orderBy('id', 'desc')->get();

        return Inertia::render('GradeViewer', [
            'grades' => $grades
        ]);
    }

    // Student view (school/grade.tsx)
    public function schoolView()
    {
        $grades = GradeViewer::orderBy('id', 'desc')->get();

        return Inertia::render('school/grade', [
            'grades' => $grades,
        ]);
    }

   public function updateGrade(Request $request)
{
    $request->validate([
        'id' => 'required|integer|exists:grade_viewers,id',
        'grade' => 'required|numeric|min:0|max:100',
    ]);

    $grade = GradeViewer::findOrFail($request->id);
    $grade->grade = $request->grade;
    $grade->save();

    return redirect()->back()->with('success', 'Grade updated successfully.');
}


    public function store(Request $request)
    {
        $request->validate([
            'id_number' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'extra_name' => 'nullable|string|max:255',
            'program' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'grade' => 'nullable|numeric|min:0|max:100',
            'date_validated' => 'nullable|date',
        ]);

        GradeViewer::create($request->all());

        return redirect()->route('grade-viewer.index');
    }
}
