<?php


namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::orderBy('published_at', 'desc')->get();

        return Inertia::render('Announcements', [
            'announcements' => $announcements
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
        ]);

        Announcement::create($request->all());

        return redirect()->route('announcements');
    }
  

    public function schoolAnnouncement()
{
    $announcement = Announcement::whereNotNull('published_at')
        ->orderBy('published_at', 'desc')
        ->get();

    return Inertia::render('school/announcement', [
        'announcement' => $announcement->toArray(),
    ]);
}

    
}
