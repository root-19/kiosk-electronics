<?php

namespace App\Http\Controllers;

use App\Models\Accomplishment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AccomplishmentController extends Controller
{
    /**
     * Display a listing of the resource for admin
     */
    public function index()
    {
        $accomplishments = Accomplishment::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Accomplish', [
            'accomplishments' => $accomplishments->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'type' => $item->type,
                    'photos' => $item->photos ?? [],
                    'created_at' => $item->created_at->format('Y-m-d'),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created accomplishment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:255',
            'photos.*' => 'image|max:5120', // 5MB max per image
        ]);

        $photos = [];
        
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('accomplishments', 'public');
                $photos[] = $path;
            }
        }

        Accomplishment::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'photos' => $photos,
        ]);

        return redirect()->back()->with('success', 'Accomplishment created successfully!');
    }

    /**
     * Display accomplishments for school/public view
     */
    public function schoolView()
    {
        $accomplishments = Accomplishment::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('school/accomplish', [
            'accomplishments' => $accomplishments->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'type' => $item->type,
                    'photos' => $item->photos ?? [],
                    'created_at' => $item->created_at->format('Y-m-d'),
                ];
            }),
        ]);
    }
}
