<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfessorController extends Controller
{
    public function index()
    {
        $professors = Professor::with('schedules.section', 'schedules.subject')
            ->orderBy('last_name')
            ->paginate(10);

        return Inertia::render('Professors/Index', [
            'professors' => $professors,
        ]);
    }

    public function create()
    {
        return Inertia::render('Professors/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:professors,email',
            'employee_id' => 'required|string|unique:professors,employee_id',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        Professor::create($request->all());

        return redirect()->route('professors.index')
            ->with('success', 'Professor created successfully.');
    }

    public function show(Professor $professor)
    {
        $professor->load('schedules.section', 'schedules.subject');
        
        return Inertia::render('Professors/Show', [
            'professor' => $professor,
        ]);
    }

    public function edit(Professor $professor)
    {
        return Inertia::render('Professors/Edit', [
            'professor' => $professor,
        ]);
    }

    public function update(Request $request, Professor $professor)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:professors,email,' . $professor->id,
            'employee_id' => 'required|string|unique:professors,employee_id,' . $professor->id,
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $professor->update($request->all());

        return redirect()->route('professors.index')
            ->with('success', 'Professor updated successfully.');
    }

    public function destroy(Professor $professor)
    {
        $professor->delete();

        return redirect()->route('professors.index')
            ->with('success', 'Professor deleted successfully.');
    }
}
