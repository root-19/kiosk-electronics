<?php


namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $imagePath = null;
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('announcements', $imageName, 'public');
        }

        Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'published_at' => $request->published_at,
            'image_path' => $imagePath,
        ]);

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
