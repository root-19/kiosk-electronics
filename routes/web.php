<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\GradeViewerController;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/accomplish', function () {
        return Inertia::render('Accomplish');
    })->name('accomplish');

    Route::get('/announcements', [AnnouncementController::class, 'index'])
        ->name('announcements');

    Route::post('/announcements', [AnnouncementController::class, 'store'])
        ->name('announcements.store');


Route::get('/grade-viewer', [GradeViewerController::class, 'index'])->name('grade-viewer.index');
Route::post('/grade-viewer', [GradeViewerController::class, 'store'])->name('grade-viewer.store');
Route::post('/grade-viewer/update-grade', [GradeViewerController::class, 'updateGrade'])->name('grade-viewer.update');

    Route::get('/calendar', function () {
        return Inertia::render('Calendar');
    })->name('calendar.index');

    Route::get('/gradeviewer', function () {
        return Inertia::render('GradeViewer');
    })->name('gradeviewer');

    Route::get('/orientation', function () {
        return Inertia::render('Orientation');
    })->name('orientation');

    Route::get('/learning', function () {
        return Inertia::render('Learning');
    })->name('learning.index');

    Route::get('/schedule', function () {
        return Inertia::render('Schedule');
    })->name('schedule.index');

    Route::get('/syllabus', function () {
        return Inertia::render('Syllabus');
    })->name('syllabus.index');
});

    // for school page
Route::get('school/announcement', [AnnouncementController::class, 'schoolAnnouncement'])
    ->name('school.announcement');
Route::get('/school/grade', [GradeViewerController::class, 'schoolView'])->name('school.grade');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
