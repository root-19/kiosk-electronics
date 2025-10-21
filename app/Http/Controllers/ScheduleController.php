<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Section;
use App\Models\Professor;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with(['section', 'professor', 'subject'])
            ->orderBy('section_id')
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->paginate(20);

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
        ]);
    }

    public function create()
    {
        $sections = Section::where('is_active', true)->orderBy('name')->get();
        $professors = Professor::where('is_active', true)->orderBy('last_name')->get();
        $subjects = Subject::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Schedules/Create', [
            'sections' => $sections,
            'professors' => $professors,
            'subjects' => $subjects,
            'timeSlots' => Schedule::getTimeSlots(),
            'daysOfWeek' => Schedule::getDaysOfWeek(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'professor_id' => 'required|exists:professors,id',
            'subject_id' => 'required|exists:subjects,id',
            'day_of_week' => 'required|in:' . implode(',', Schedule::getDaysOfWeek()),
            'time_slot' => 'required|in:' . implode(',', Schedule::getTimeSlots()),
            'room' => 'nullable|string|max:255',
        ]);

        // Check for conflicts
        $conflict = Schedule::where('section_id', $request->section_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('time_slot', $request->time_slot)
            ->first();

        if ($conflict) {
            return back()->withErrors([
                'time_slot' => 'This time slot is already occupied for this section on this day.'
            ]);
        }

        Schedule::create($request->all());

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule created successfully.');
    }

    public function show(Schedule $schedule)
    {
        $schedule->load(['section', 'professor', 'subject']);
        
        return Inertia::render('Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function edit(Schedule $schedule)
    {
        $sections = Section::where('is_active', true)->orderBy('name')->get();
        $professors = Professor::where('is_active', true)->orderBy('last_name')->get();
        $subjects = Subject::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Schedules/Edit', [
            'schedule' => $schedule,
            'sections' => $sections,
            'professors' => $professors,
            'subjects' => $subjects,
            'timeSlots' => Schedule::getTimeSlots(),
            'daysOfWeek' => Schedule::getDaysOfWeek(),
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'professor_id' => 'required|exists:professors,id',
            'subject_id' => 'required|exists:subjects,id',
            'day_of_week' => 'required|in:' . implode(',', Schedule::getDaysOfWeek()),
            'time_slot' => 'required|in:' . implode(',', Schedule::getTimeSlots()),
            'room' => 'nullable|string|max:255',
        ]);

        // Check for conflicts (excluding current schedule)
        $conflict = Schedule::where('section_id', $request->section_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('time_slot', $request->time_slot)
            ->where('id', '!=', $schedule->id)
            ->first();

        if ($conflict) {
            return back()->withErrors([
                'time_slot' => 'This time slot is already occupied for this section on this day.'
            ]);
        }

        $schedule->update($request->all());

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule updated successfully.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Schedule deleted successfully.');
    }

    public function sectionSchedule(Section $section)
    {
        $section->load(['schedules.professor', 'schedules.subject']);
        
        // Group schedules by day and time
        $scheduleGrid = [];
        $daysOfWeek = Schedule::getDaysOfWeek();
        $timeSlots = Schedule::getTimeSlots();

        foreach ($daysOfWeek as $day) {
            $scheduleGrid[$day] = [];
            foreach ($timeSlots as $timeSlot) {
                $scheduleGrid[$day][$timeSlot] = null;
            }
        }

        foreach ($section->schedules as $schedule) {
            $scheduleGrid[$schedule->day_of_week][$schedule->time_slot] = $schedule;
        }

        return Inertia::render('Schedules/SectionSchedule', [
            'section' => $section,
            'scheduleGrid' => $scheduleGrid,
            'daysOfWeek' => $daysOfWeek,
            'timeSlots' => $timeSlots,
        ]);
    }

    public function viewSchedule()
    {
        $sections = Section::where('is_active', true)->orderBy('name')->get();
        $schedules = Schedule::with(['section', 'professor', 'subject'])
            ->orderBy('section_id')
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->paginate(100);

        return Inertia::render('Schedule', [
            'sections' => $sections,
            'schedules' => $schedules,
        ]);
    }

    public function schoolViewSchedule()
    {
        $sections = Section::where('is_active', true)->orderBy('name')->get();
        $schedules = Schedule::with(['section', 'professor', 'subject'])
            ->orderBy('section_id')
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->paginate(100);

        return Inertia::render('school/view-schedule', [
            'sections' => $sections,
            'schedules' => $schedules,
        ]);
    }
}
