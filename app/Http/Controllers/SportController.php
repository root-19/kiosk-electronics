<?php

namespace App\Http\Controllers;

use App\Models\Sport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sports = Sport::withCount('delegates')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Delegates', [
            'sports' => $sports
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Sport::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('delegates.index')->with('success', 'Sport added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sport = Sport::with('delegates')->findOrFail($id);

        return Inertia::render('Sports/Show', [
            'sport' => $sport
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $sport = Sport::findOrFail($id);
        $sport->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('delegates.index')->with('success', 'Sport updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sport = Sport::findOrFail($id);
        $sport->delete();

        return redirect()->route('delegates.index')->with('success', 'Sport deleted successfully!');
    }

    /**
     * Display sports listing for kiosk view
     */
    public function kioskIndex()
    {
        $sports = Sport::withCount('delegates')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('school/delegates', [
            'sports' => $sports
        ]);
    }

    /**
     * Display sport delegates for kiosk view
     */
    public function kioskShow(string $id)
    {
        $sport = Sport::with('delegates')->findOrFail($id);

        return Inertia::render('school/sport-delegates', [
            'sport' => $sport
        ]);
    }
}
