<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\Professor;
use App\Models\Subject;
use App\Models\Schedule;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample sections
        $sections = [
            ['name' => 'Grade 7-A', 'code' => 'G7A', 'description' => 'Grade 7 Section A', 'capacity' => 40],
            ['name' => 'Grade 7-B', 'code' => 'G7B', 'description' => 'Grade 7 Section B', 'capacity' => 35],
            ['name' => 'Grade 8-A', 'code' => 'G8A', 'description' => 'Grade 8 Section A', 'capacity' => 42],
            ['name' => 'STEM-11', 'code' => 'STEM11', 'description' => 'STEM Grade 11', 'capacity' => 30],
            ['name' => 'ABM-12', 'code' => 'ABM12', 'description' => 'ABM Grade 12', 'capacity' => 28],
        ];

        foreach ($sections as $sectionData) {
            Section::create($sectionData);
        }

        // Create sample professors
        $professors = [
            ['first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria.santos@school.edu', 'employee_id' => 'EMP001', 'department' => 'Mathematics'],
            ['first_name' => 'Juan', 'last_name' => 'Cruz', 'email' => 'juan.cruz@school.edu', 'employee_id' => 'EMP002', 'department' => 'Science'],
            ['first_name' => 'Ana', 'last_name' => 'Reyes', 'email' => 'ana.reyes@school.edu', 'employee_id' => 'EMP003', 'department' => 'English'],
            ['first_name' => 'Pedro', 'last_name' => 'Lopez', 'email' => 'pedro.lopez@school.edu', 'employee_id' => 'EMP004', 'department' => 'Filipino'],
            ['first_name' => 'Lisa', 'last_name' => 'Garcia', 'email' => 'lisa.garcia@school.edu', 'employee_id' => 'EMP005', 'department' => 'Social Studies'],
        ];

        foreach ($professors as $professorData) {
            Professor::create($professorData);
        }

        // Create sample subjects
        $subjects = [
            ['code' => 'MATH7', 'name' => 'Mathematics 7', 'description' => 'Basic Mathematics for Grade 7', 'units' => 3, 'department' => 'Mathematics'],
            ['code' => 'SCI7', 'name' => 'Science 7', 'description' => 'General Science for Grade 7', 'units' => 3, 'department' => 'Science'],
            ['code' => 'ENG7', 'name' => 'English 7', 'description' => 'English Language Arts Grade 7', 'units' => 3, 'department' => 'English'],
            ['code' => 'FIL7', 'name' => 'Filipino 7', 'description' => 'Filipino Language Grade 7', 'units' => 3, 'department' => 'Filipino'],
            ['code' => 'SS7', 'name' => 'Social Studies 7', 'description' => 'Social Studies Grade 7', 'units' => 3, 'department' => 'Social Studies'],
            ['code' => 'MATH8', 'name' => 'Mathematics 8', 'description' => 'Intermediate Mathematics for Grade 8', 'units' => 3, 'department' => 'Mathematics'],
            ['code' => 'STEM11-MATH', 'name' => 'Pre-Calculus', 'description' => 'Pre-Calculus for STEM 11', 'units' => 4, 'department' => 'Mathematics'],
            ['code' => 'STEM11-SCI', 'name' => 'General Physics', 'description' => 'Physics for STEM 11', 'units' => 4, 'department' => 'Science'],
            ['code' => 'ABM12-BUS', 'name' => 'Business Mathematics', 'description' => 'Business Math for ABM 12', 'units' => 3, 'department' => 'Mathematics'],
        ];

        foreach ($subjects as $subjectData) {
            Subject::create($subjectData);
        }

        // Create sample schedules
        $sections = Section::all();
        $professors = Professor::all();
        $subjects = Subject::all();

        $sampleSchedules = [
            // Grade 7-A Schedule
            ['section' => 'G7A', 'professor' => 'EMP001', 'subject' => 'MATH7', 'day' => 'monday', 'time' => '7:30-8:30', 'room' => 'Room 101'],
            ['section' => 'G7A', 'professor' => 'EMP002', 'subject' => 'SCI7', 'day' => 'monday', 'time' => '8:30-9:30', 'room' => 'Lab 1'],
            ['section' => 'G7A', 'professor' => 'EMP003', 'subject' => 'ENG7', 'day' => 'tuesday', 'time' => '7:30-8:30', 'room' => 'Room 102'],
            ['section' => 'G7A', 'professor' => 'EMP004', 'subject' => 'FIL7', 'day' => 'tuesday', 'time' => '8:30-9:30', 'room' => 'Room 103'],
            ['section' => 'G7A', 'professor' => 'EMP005', 'subject' => 'SS7', 'day' => 'wednesday', 'time' => '7:30-8:30', 'room' => 'Room 104'],
            
            // Grade 7-B Schedule
            ['section' => 'G7B', 'professor' => 'EMP001', 'subject' => 'MATH7', 'day' => 'monday', 'time' => '9:30-10:30', 'room' => 'Room 101'],
            ['section' => 'G7B', 'professor' => 'EMP002', 'subject' => 'SCI7', 'day' => 'tuesday', 'time' => '9:30-10:30', 'room' => 'Lab 1'],
            ['section' => 'G7B', 'professor' => 'EMP003', 'subject' => 'ENG7', 'day' => 'wednesday', 'time' => '8:30-9:30', 'room' => 'Room 102'],
            ['section' => 'G7B', 'professor' => 'EMP004', 'subject' => 'FIL7', 'day' => 'thursday', 'time' => '7:30-8:30', 'room' => 'Room 103'],
            ['section' => 'G7B', 'professor' => 'EMP005', 'subject' => 'SS7', 'day' => 'thursday', 'time' => '8:30-9:30', 'room' => 'Room 104'],
            
            // Grade 8-A Schedule
            ['section' => 'G8A', 'professor' => 'EMP001', 'subject' => 'MATH8', 'day' => 'monday', 'time' => '10:30-11:30', 'room' => 'Room 105'],
            ['section' => 'G8A', 'professor' => 'EMP002', 'subject' => 'SCI7', 'day' => 'tuesday', 'time' => '10:30-11:30', 'room' => 'Lab 2'],
            ['section' => 'G8A', 'professor' => 'EMP003', 'subject' => 'ENG7', 'day' => 'wednesday', 'time' => '9:30-10:30', 'room' => 'Room 106'],
            
            // STEM-11 Schedule
            ['section' => 'STEM11', 'professor' => 'EMP001', 'subject' => 'STEM11-MATH', 'day' => 'monday', 'time' => '1:30-2:30', 'room' => 'Room 201'],
            ['section' => 'STEM11', 'professor' => 'EMP002', 'subject' => 'STEM11-SCI', 'day' => 'tuesday', 'time' => '1:30-2:30', 'room' => 'Lab 3'],
            ['section' => 'STEM11', 'professor' => 'EMP001', 'subject' => 'STEM11-MATH', 'day' => 'thursday', 'time' => '1:30-2:30', 'room' => 'Room 201'],
            
            // ABM-12 Schedule
            ['section' => 'ABM12', 'professor' => 'EMP001', 'subject' => 'ABM12-BUS', 'day' => 'monday', 'time' => '2:30-3:30', 'room' => 'Room 301'],
            ['section' => 'ABM12', 'professor' => 'EMP005', 'subject' => 'SS7', 'day' => 'wednesday', 'time' => '2:30-3:30', 'room' => 'Room 302'],
        ];

        foreach ($sampleSchedules as $scheduleData) {
            $section = $sections->where('code', $scheduleData['section'])->first();
            $professor = $professors->where('employee_id', $scheduleData['professor'])->first();
            $subject = $subjects->where('code', $scheduleData['subject'])->first();

            if ($section && $professor && $subject) {
                Schedule::create([
                    'section_id' => $section->id,
                    'professor_id' => $professor->id,
                    'subject_id' => $subject->id,
                    'day_of_week' => $scheduleData['day'],
                    'time_slot' => $scheduleData['time'],
                    'room' => $scheduleData['room'],
                ]);
            }
        }
    }
}