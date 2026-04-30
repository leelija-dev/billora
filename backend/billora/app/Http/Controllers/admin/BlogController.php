<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;

class BlogController extends Controller
{
 public function index(Request $request)
{
    try {

        $search = $request->search;
        $categoryId = $request->category_id;

        $blogs = Blog::with('categories','tags')
            ->where('status', true)
            // Search
            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {

                    $q->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('slug', 'LIKE', "%{$search}%")
                        ->orWhere('feature_image', 'LIKE', "%{$search}%")
                        ->orWhere('feature_image_alt', 'LIKE', "%{$search}%")
                        ->orWhere('excerpt', 'LIKE', "%{$search}%")
                        ->orWhere('content', 'LIKE', "%{$search}%")
                        ->orWhere('meta_title', 'LIKE', "%{$search}%")
                        ->orWhere('meta_description', 'LIKE', "%{$search}%")
                        ->orWhere('meta_tag', 'LIKE', "%{$search}%")
                        ->orWhere('keywords', 'LIKE', "%{$search}%")
                        ->orWhere('schema', 'LIKE', "%{$search}%");

                });
            })

            // Category filter
            ->when($categoryId, function ($query) use ($categoryId) {

                $query->whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                });
            })

            ->latest()
            ->paginate(12);

        $categories = Category::where('status', true)->get();

        return response()->json([
            'status' => true,
            'message' => 'All Blogs list with pagination',
            'categories' => $categories,
            'blogs' => $blogs,
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
 public function allCategrories(){
    try{
    $categories = Category::where('status',true)->get();
    return response()->json([
        'status'=>true,
        'message'=>'All categories',
        'categories'=>$categories
    ]);
    }catch(\Exception $e){
        return response()->json([
            'status'=>false,
            'message'=>$e->getMessage()
        ]);
    }
 }
}
