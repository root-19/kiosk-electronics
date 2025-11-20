<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class CalendarController extends Controller
{
    /**
     * Display the calendar page
     */
    public function index()
    {
        $events = Calendar::where('is_active', true)
            ->orderBy('event_date', 'asc')
            ->get();

        return Inertia::render('Calendar', [
            'events' => $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'event_date' => $event->event_date->format('Y-m-d'),
                    'event_type' => $event->event_type,
                ];
            }),
        ]);
    }

 
    public function schoolIndex()
    {
        $events = Calendar::where('is_active', true)
            ->orderBy('event_date', 'asc')
            ->get();

        return Inertia::render('school/calendar', [
            'events' => $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'event_date' => $event->event_date->format('Y-m-d'),
                    'event_type' => $event->event_type,
                ];
            }),
        ]);
    }

    /**
     * Store a new calendar event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_type' => 'required|in:holiday,academic,sports,general',
        ]);

        Calendar::create($validated);

        return redirect()->back()->with('success', 'Calendar event created successfully!');
    }

    /**
     * Update an existing calendar event
     */
    public function update(Request $request, Calendar $calendar)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_type' => 'required|in:holiday,academic,sports,general',
        ]);

        $calendar->update($validated);

        return redirect()->back()->with('success', 'Calendar event updated successfully!');
    }

    /**
     * Get events for a specific month
     */
    public function getEvents(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));

        $events = Calendar::where('is_active', true)
            ->whereYear('event_date', $year)
            ->whereMonth('event_date', $month)
            ->get();

        return response()->json([
            'events' => $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'event_date' => $event->event_date->format('Y-m-d'),
                    'event_type' => $event->event_type,
                ];
            }),
        ]);
    }
}
