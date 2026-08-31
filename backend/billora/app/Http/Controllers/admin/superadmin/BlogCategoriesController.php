<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;   
use Illuminate\Support\Str; 
use Illuminate\Support\Facades\Cache;
class BlogCategoriesController extends Controller
{
    public function index(Request $request){
        $cacheKey = "blog_category_index_" . md5($request->fullUrl());
        $data = Cache::tags(['blog_categories'])->remember($cacheKey,600,function () use ($request) {
        $Categories = Category::when($request->search, function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')    
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
        })->paginate(10);
        return[
            'Categories' => $Categories
        ];
        });
        return view('admin.blog_category.index', $data);
    }
    public function create(){
        return view('admin.blog_category.create');
    }
    public function store(Request $request){
        $data = $request->validate([
            'name'=>'required|string|max:255',
            'description'=>'nullable|string',
            'status'=>'required|boolean',
            // 'slug'=>'required|string|max:255|unique:categories,slug'
            ]);
        $data['slug'] = Str::slug($data['name']);
        try{
            Category::create($data);
            Cache::tags(['blog_categories'])->flush();
            return redirect()->route('admin.category.index')
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create category.');
        }
    }
    public function edit($id){
        Cache::tags(['blog_categories'])->flush();
        $category = Category::findOrFail($id);
        return view('admin.blog_category.edit',compact('category'));
    }
    public function update(Request $request, $id){
        $category = Category::findOrFail($id);  
        
        $data = $request->validate([
            'name'=>'required|string|max:255',
            'description'=>'nullable|string',
            'status'=>'required|boolean',
            // 'slug'=>'required|string|max:255|unique:categories,slug'
            ]);
        
        try{
            // $data['slug'] = Str::slug($data['name']);
            $category->update($data);
            Cache::tags(['blog_categories'])->flush();
            return redirect()->route('admin.category.index')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update category.');
        }
    }
    public function delete($id){
        $category = Category::findOrFail($id);
        try{
            $category->delete();
            Cache::tags(['blog_categories'])->flush();
            return redirect()->route('admin.category.index')
                ->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
