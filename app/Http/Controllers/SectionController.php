<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::with('schedules.professor', 'schedules.subject')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Sections/Index', [
            'sections' => $sections,
        ]);
    }

    public function create()
    {
        return Inertia::render('Sections/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:sections,code',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1|max:100',
        ]);

        Section::create($request->all());

        return redirect()->route('sections.index')
            ->with('success', 'Section created successfully.');
    }

    public function show(Section $section)
    {
        $section->load('schedules.professor', 'schedules.subject');
        
        return Inertia::render('Sections/Show', [
            'section' => $section,
        ]);
    }

    public function edit(Section $section)
    {
        return Inertia::render('Sections/Edit', [
            'section' => $section,
        ]);
    }

    public function update(Request $request, Section $section)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:sections,code,' . $section->id,
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1|max:100',
        ]);

        $section->update($request->all());

        return redirect()->route('sections.index')
            ->with('success', 'Section updated successfully.');
    }

    public function destroy(Section $section)
    {
        $section->delete();

        return redirect()->route('sections.index')
            ->with('success', 'Section deleted successfully.');
    }
}
