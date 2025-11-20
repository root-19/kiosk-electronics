<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\GradeViewerController;
use App\Http\Controllers\SyllabusController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\DelegateController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\AccomplishmentController;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/accomplish', [AccomplishmentController::class, 'index'])->name('accomplish');
    Route::post('/accomplish', [AccomplishmentController::class, 'store'])->name('accomplish.store');

    Route::get('/announcements', [AnnouncementController::class, 'index'])
        ->name('announcements');

    Route::post('/announcements', [AnnouncementController::class, 'store'])
        ->name('announcements.store');


Route::get('/grade-viewer', [GradeViewerController::class, 'index'])->name('grade-viewer.index');
Route::get('/gradeviewer', [GradeViewerController::class, 'index'])->name('gradeviewer');
Route::post('/grade-viewer', [GradeViewerController::class, 'store'])->name('grade-viewer.store');
Route::post('/grade-viewer/update-grade', [GradeViewerController::class, 'updateGrade'])->name('grade-viewer.update');

    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    Route::post('/calendar/events', [CalendarController::class, 'store'])->name('calendar.events.store');
    Route::put('/calendar/events/{calendar}', [CalendarController::class, 'update'])->name('calendar.events.update');


    Route::get('/orientation', function () {
        return Inertia::render('Orientation');
    })->name('orientation');

    Route::get('/learning', [SyllabusController::class, 'learningIndex'])->name('learning.index');

    Route::get('/view-schedule', [ScheduleController::class, 'viewSchedule'])->name('view-schedule.index');
    Route::get('/schedule', [ScheduleController::class, 'viewSchedule'])->name('schedule.index');

    Route::get('/syllabus', [SyllabusController::class, 'index'])->name('syllabus.index');
    Route::post('/syllabus', [SyllabusController::class, 'store'])->name('syllabus.store');
    Route::get('/syllabus/{id}/download', [SyllabusController::class, 'download'])->name('syllabus.download');
    Route::delete('/syllabus/{id}', [SyllabusController::class, 'destroy'])->name('syllabus.destroy');
    Route::patch('/syllabus/{id}/toggle', [SyllabusController::class, 'toggle'])->name('syllabus.toggle');

    // Section Management Routes
    Route::resource('sections', SectionController::class);
    Route::get('/sections/kiosk/create', function () {
        return Inertia::render('Sections/KioskCreate');
    })->name('sections.kiosk.create');
    
    // Professor Management Routes
    Route::resource('professors', ProfessorController::class);
    
    // Subject Management Routes
    Route::resource('subjects', SubjectController::class);
    
    // Schedule Management Routes
    Route::resource('schedules', ScheduleController::class);
    Route::get('/sections/{section}/schedule', [ScheduleController::class, 'sectionSchedule'])->name('sections.schedule');
    
    // Sports and Delegates Routes
    Route::get('/delegates', [SportController::class, 'index'])->name('delegates.index');
    Route::resource('sports', SportController::class);
    Route::resource('delegates', DelegateController::class)->except(['index']);
});

    // for school page
Route::get('school/announcement', [AnnouncementController::class, 'schoolAnnouncement'])
    ->name('school.announcement');
Route::get('/school/grade', [GradeViewerController::class, 'schoolView'])->name('school.grade');
Route::get('/school/syllabus', [SyllabusController::class, 'schoolView'])->name('school.syllabus');
Route::get('/school/view-schedule', [ScheduleController::class, 'schoolViewSchedule'])->name('school.view-schedule');
Route::get('/school/delegates', [SportController::class, 'kioskIndex'])->name('school.delegates');
Route::get('/school/sports/{id}', [SportController::class, 'kioskShow'])->name('school.sports.show');
Route::get('/school/calendar', [CalendarController::class, 'schoolIndex'])->name('school.calendar');
Route::post('/school/calendar/events', [CalendarController::class, 'store'])->name('school.calendar.events.store');
Route::get('/school/accomplish', [AccomplishmentController::class, 'schoolView'])->name('school.accomplish');
Route::get('/school/learning', [SyllabusController::class, 'schoolLearning'])->name('school.learning');

// Test route to verify school syllabus is accessible
Route::get('/test/school-syllabus', function () {
    return 'School syllabus route is working!';
});


// Public file viewing route for school pages
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    return response()->file($fullPath);
})->where('path', '.*')->name('storage.public');

// Debug route to check syllabus data
Route::get('/debug/syllabus', function () {
    $syllabi = App\Models\Syllabus::where('is_active', true)->get();
    
    return response()->json([
        'count' => $syllabi->count(),
        'syllabi' => $syllabi->map(function($s) {
            return [
                'id' => $s->id,
                'file_name' => $s->file_name,
                'file_path' => $s->file_path,
                'file_type' => $s->file_type,
                'file_exists' => file_exists(storage_path('app/public/' . $s->file_path)),
                'storage_url' => url('/storage/' . $s->file_path)
            ];
        })
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
