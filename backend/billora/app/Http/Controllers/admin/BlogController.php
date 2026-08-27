<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\BlogTags;
use App\Models\Category;
use App\Models\Tags;

class BlogController extends Controller
{
 public function index(Request $request)
{
    try {

        $search = $request->search;
        $categoryId = $request->category_id;

        $blogs = Blog::with(['categories','tags','faqs','user:id,fname,lname,image,description','user.roles:id,name'])
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
public function blogTags($tag)
{
    try {

        $blogs = Blog::with([
                'categories',
                'tags',
                'faqs',
                'user:id,fname,lname,image,description',
                'user.roles:id,name'
            ])
            ->where('status', true)
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('tag_name', $tag);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(2);

        return response()->json([
            'status' => true,
            'message' => 'Blogs by tag',
            'blogs' => $blogs
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}

public function blogCategory($slug)
{
    try {

        $blogs = Blog::with([
                'categories',
                'tags',
                'faqs',
                'user:id,fname,lname,image,description',
                'user.roles:id,name'
            ])
            ->where('status', true)
            ->whereHas('categories', function ($query) use ($slug) {
                $query->where('categories.slug', $slug);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(2);

        return response()->json([
            'status' => true,
            'message' => 'Blogs by category',
            'blogs' => $blogs
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
 public function show($slug){
    try{
        $blog = Blog::with(['categories','tags','faqs','user:id,fname,lname,image,description','user.roles:id,name'])->where('status',true)->where('slug',$slug)->first();

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
