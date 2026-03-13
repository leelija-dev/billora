<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categories;
use Illuminate\Support\Str;

class CategoriesController extends Controller
{
    public function index()
    {
        $categories = Categories::paginate(15);
        return response()->json([
            'status' => true,
            'message' => 'Category List',
            'data' => $categories
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'is_active' => 'required',
            'created_by' => 'nullable',
            'description' => 'nullable'
        ]);
        $data['slug'] = Str::slug($data['name']);
        $category = Categories::create($data);
        return response()->json([
            'status' => true,
            'message' => 'Category Created Successfully',
            'data' => $category
        ]);
    }
     public function edit($id)
    {
        $category = Categories::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'Single Category Details',
            'data' => $category
        ]);
    }
    public function update(Request $request, $id)
    {
        
        $data = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'is_active' => 'required',
            'created_by' => 'nullable',
            'description' => 'nullable'
        ]);
        try{
        $category = Categories::where('id', $id)
            ->where('user_id', $data['user_id'])
            ->firstOrFail();
        $category->update($data);
        return response()->json([
            'status' => true,
            'message' => 'Category Updated Successfully',
            'data' => $category
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
   
    public function delete($id)
    {
        $category = Categories::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Category Deleted Successfully',
            'data' => null
        ]);
    }
}
