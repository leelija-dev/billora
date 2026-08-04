<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\Features;
use Illuminate\Http\Request;

class FeaturesController extends Controller
{
    public function index()
    {
        $features = Features::orderBy('id', 'desc')->paginate(10);
        return view('admin.features.index', compact('features'));
    }
    public function create()
    {
        return view('admin.features.create');
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'features' => 'required|array|min:1',
            'features.*' => 'required|string|max:255',
        ]);
        try{
            foreach($data['features'] as $feature){
                Features::create(['name' => $feature]);
            }
            return redirect()->route('admin.features.index')->with('success', 'Feature created successfully.');
        }catch( \Exception $e){
            return redirect()->back()->with('error', 'An error occurred while creating the feature: ' . $e->getMessage());

        }

    }
    public function edit($id)
    {
        $feature = Features::findOrFail($id);
        return view('admin.features.edit', compact('feature'));
    }
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        try{
            $feature = Features::findOrFail($id);
            $feature->update($data);
            return redirect()->route('admin.features.index')->with('success', 'Feature updated successfully.');
        }catch( \Exception $e){
            return redirect()->back()->with('error', 'An error occurred while updating the feature: ' . $e->getMessage());
        }
    }
    public function delete($id)
    {
        try{
            $feature = Features::findOrFail($id);
            $feature->delete();
            return redirect()->route('admin.features.index')->with('success', 'Feature deleted successfully.');
        }catch( \Exception $e){
            return redirect()->back()->with('error', 'An error occurred while deleting the feature: ' . $e->getMessage());
        }
    }
}
