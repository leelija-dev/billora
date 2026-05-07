<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tags;

class BlogController extends Controller
{
 public function index(Request $request)
{
    try {

        $search = $request->search;
        $categoryId = $request->category_id;

        $blogs = Blog::with(['categories','tags','faqs','user'])
            ->where('status', true)
            ->orderBy('created_at', 'desc')
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
            ->paginate(6);

        $categories = Category::where('status', true)->get();
        // $tags = Tags::where('status', true)->get();
        return response()->json([
            'status' => true,
            'message' => 'All Blogs list with pagination',
            'categories' => $categories,
            'blogs' => $blogs,
            // 'tags' => $tags
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
 public function show($slug){
    try{
        $blog = Blog::with(['categories','tags','faqs','user'])->where('status',true)->where('slug',$slug)->first();

        return response()->json([
            'status'=>true,
            'message'=>'Blog details',
            'blog'=>$blog
        ]);

    }catch(\Exception $e){
        return response()->json([
            'status'=>false,
            'message'=>$e->getMessage()
        ]);
    }
 }
}
