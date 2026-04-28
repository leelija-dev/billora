<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tags;
class TagsController extends Controller
{
    public function index(){
        $tags = Tags::where('status',true)->get();
        return view('admin.blog_tags.index',compact('tags'));
    }
    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tags,slug',
            'status' => 'required|boolean'
            
        ]);

        try {
            Tags::create($data);

            return redirect()->route('admin.blog_tags.index')
                ->with('success', 'Tag created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while creating the tag.']);
        }
    }
    public function edit($id){
        $tag = Tags::findOrFail($id);
        return view('admin.blog_tags.edit',compact('tag'));
    }
    public function update(Request $request ,$id){
        $tag = Tags::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean'
            
        ]);

        try {
            $tag->update($data);

            return redirect()->route('admin.blog_tags.index')
                ->with('success', 'Tag updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while updating the tag.']);
        }

    }
    public function destroy($id){
        $tag = Tags::findOrFail($id);
        try {
            $tag->delete();
            return redirect()->route('admin.blog_tags.index')
                ->with('success', 'Tag deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while deleting the tag.']);
        }
    }
}
