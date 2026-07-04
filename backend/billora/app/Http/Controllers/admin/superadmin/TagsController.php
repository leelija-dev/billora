<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tags;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
class TagsController extends Controller
{
    public function index(Request $request){
        $cacheKey = "tags_index_" . md5($request->fullUrl());
        $data = Cache::tags(['tags'])->remember($cacheKey,600,function () use ($request) {
        $tags = Tags::when($request->search, function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->search . '%')  
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
        })->paginate(10);
        return[
            'tags' => $tags
        ];
        });
       
        return view('admin.blog_tags.index', $data);
    }
    public function create(){
        return view('admin.blog_tags.create');
    }
    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
            // 'slug' => 'required|string|max:255|unique:tags,slug'
            
        ]);
        $user = Auth::guard('admin')->user();
        // Log::info('logged in super admin user id', ['user_id' => $user]);
        $data['slug'] = Str::slug($data['name']);
        try {
            Tags::create($data);    
            Cache::tags(['tags'])->flush();
            return redirect()->route('admin.blog-tag.index')
                ->with('success', 'Tag created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while creating the tag.']);
        }
    }
    public function edit($id){
        $tag = Tags::findOrFail($id);
        Cache::tags(['tags'])->flush();
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
            Cache::tags(['tags'])->flush();
            return redirect()->route('admin.blog-tag.index')
                ->with('success', 'Tag updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while updating the tag.']);
        }

    }
    public function destroy($id){
        $tag = Tags::findOrFail($id);
        try {
            $tag->delete();
            Cache::tags(['tags'])->flush();
            return redirect()->route('admin.blog-tags.index')
                ->with('success', 'Tag deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'An error occurred while deleting the tag.']);
        }
    }
}
