<?php

namespace App\Http\Controllers;

use App\Models\Delegate;
use App\Models\Sport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DelegateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $delegates = Delegate::with('sport')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Delegates/Index', [
            'delegates' => $delegates
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sport_id' => 'required|exists:sports,id',
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $imagePath = null;
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('delegates', $imageName, 'public');
        }

        Delegate::create([
            'sport_id' => $request->sport_id,
            'name' => $request->name,
            'position' => $request->position,
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Delegate added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $delegate = Delegate::with('sport')->findOrFail($id);

        return Inertia::render('Delegates/Show', [
            'delegate' => $delegate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'sport_id' => 'required|exists:sports,id',
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        $delegate = Delegate::findOrFail($id);
        
        $imagePath = $delegate->image_path;
        
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('delegates', $imageName, 'public');
        }

        $delegate->update([
            'sport_id' => $request->sport_id,
            'name' => $request->name,
            'position' => $request->position,
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Delegate updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $delegate = Delegate::findOrFail($id);
        
        // Delete image from storage
        if ($delegate->image_path && Storage::disk('public')->exists($delegate->image_path)) {
            Storage::disk('public')->delete($delegate->image_path);
        }
        
        $delegate->delete();

        return back()->with('success', 'Delegate deleted successfully!');
    }
}
