<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tags;
use App\Models\BlogCategories;
use App\Models\BlogFaq;
use App\Models\BlogTags;
use App\Models\AdminUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = "blogs_index_" . md5($request->fullUrl());
        $data = Cache::tags(['blogs'])->remember($cacheKey, 600, function () use ($request) {
            $blogs = Blog::when($request->search, function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('slug', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%')
                    ->orWhere('meta_title', 'like', '%' . $request->search . '%')
                    ->orWhere('meta_description', 'like', '%' . $request->search . '%')
                    ->orWhere('keywords', 'like', '%' . $request->search . '%')
                    ->orWhere('schema', 'like', '%' . $request->search . '%')
                    ->orWhere('feature_image_alt', 'like', '%' . $request->search . '%');
            })->orderBy('id', 'desc')->paginate(10);
            // $blogs =  Blog::paginate(10);

            $deletedBlog = Blog::onlyTrashed()->count();
            $totalBlog = Blog::withTrashed()->count();
            $activeBlog = Blog::where('status', true)->count();
            $inactiveBlog = Blog::where('status', false)->count();
            $users = AdminUser::all();
            return [
                'blogs' => $blogs,
                'deletedBlog' => $deletedBlog,
                'totalBlog' => $totalBlog,
                'activeBlog' => $activeBlog,
                'inactiveBlog' => $inactiveBlog,
                'users' => $users
            ];
        });
        return view('admin.blogs.index', $data);
    }
    public function create()
    {
        $categories = Category::where('status', true)->get();
        // $tags = Tags::where('status', true)->get();
        return view('admin.blogs.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'slug'                => 'required|string|max:255|unique:blog,slug',
            'feature_image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'feature_image_alt'   => 'nullable|string|max:255',
            'excerpt'             => 'nullable|string|max:500',
            'content'             => 'required|string',
            'meta_title'          => 'nullable|string|max:255',
            'meta_description'    => 'nullable|string|max:500',
            'keywords'            => 'nullable|string|max:255',
            'schema'              => 'nullable|string',
            'status'              => 'required|boolean',

            'category_id'         => 'nullable|array',
            'category_id.*'       => 'exists:categories,id',

            // 'tags'             => 'nullable|array',
            'tags.*'           => 'nullable|string',
            'question.*'          => 'nullable|string',
            'answer.*'            => 'nullable|string',

        ]);
        // dd($validated);
        DB::beginTransaction();

        try {

            $validated['created_by'] = Auth::guard('admin')->user()->id;

            //Feature Image Upload

            if ($request->hasFile('feature_image')) {



                $file = $request->file('feature_image');

                $upload = Cloudinary::uploadApi()->upload(
                    $file->getRealPath(),
                    [
                        'folder' => 'Thefastbill/blog_images',
                        'public_id' => 'blog_image_' . time() . '_' . Str::random(8),
                        'overwrite' => false,
                        'resource_type' => 'image',
                    ]
                );

                // Save Cloudinary URL in database
                $validated['feature_image'] = $upload['secure_url'];

                // Optional: save Cloudinary public ID if your DB has a column
                $validated['feature_image_public_id'] = $upload['public_id'];
            }


            // Create Blog
            $blog = Blog::create([
                'title'              => $validated['title'],
                'slug'               => $validated['slug'],
                'feature_image'      => $validated['feature_image'] ?? null,
                'feature_image_public_id' => $validated['feature_image_public_id'] ?? null,
                'feature_image_alt'  => $validated['feature_image_alt'] ?? null,
                'excerpt'            => $validated['excerpt'] ?? null,
                'content'            => $validated['content'],
                'meta_title'         => $validated['meta_title'] ?? null,
                'meta_description'   => $validated['meta_description'] ?? null,
                'keywords'           => $validated['keywords'] ?? null,
                'schema'             => $validated['schema'] ?? null,
                'created_by'         => $validated['created_by'],
                'status'             => $validated['status'],
            ]);

            //Save Categories
            // Log::info('Blog Categories Debug', [
            //     'blog_id' => $blog->id,
            //     'category_ids' => $validated['category_id'] ?? null,
            //     'is_empty' => empty($validated['category_id'])
            // ]);

            if (!empty($validated['category_id'])) {

                $categoryData = [];

                foreach ($validated['category_id'] as $categoryId) {
                    $categoryData[] = [
                        'blog_id'     => $blog->id,
                        'category_id' => $categoryId,
                    ];
                }

                // Log::info('Category data prepared for insertion', [
                //     'category_data' => $categoryData
                // ]);

                $result = BlogCategories::insert($categoryData);

                // Log::info('Category insertion result', [
                //     'result' => $result,
                //     'inserted_count' => count($categoryData)
                // ]);
            } else {
                Log::warning('No categories selected for blog', [
                    'blog_id' => $blog->id
                ]);
            }

            //Save Tags

            $tags = array_filter($validated['tags'] ?? [],fn ($tag) => !is_null($tag) && trim($tag) !== '');

            if (!empty($tags)) {
                

                $tagData = [];
                Log::info('Tag data prepared for insertion', 
                    $validated['tags']
                );
                foreach ($validated['tags'] as $tagName) {
                    $tagData[] = [
                        'blog_id' => $blog->id,
                        'tag_name'  => $tagName,
                        'created_at' => now()
                    ];
                }

                BlogTags::insert($tagData);
            }

            //FAQ add

            if (!empty($validated['question'])) {
                // Log::info('FAQ data is not empty',$validated['question']);
                $faqData = [];

                foreach ($validated['question'] as $key => $question) {
                    if (
                        empty(trim($question ?? '')) &&
                        empty(trim($answer ?? ''))
                    ) {
                        continue;
                    }
                    $faqData[] = [
                        'blog_id'     => $blog->id,
                        'question'    => $question,
                        'answer'      => $validated['answer'][$key],
                    ];
                }
                if (!empty($faqData)) {
                    BlogFaq::insert($faqData);
                }
            }
            DB::commit();
            Cache::tags(['blogs'])->flush();
            return redirect()
                ->route('admin.blogs.index')
                ->with('success', 'Blog created successfully.');
        } catch (\Throwable $e) {

            DB::rollBack();

            // Save error in log file
            Log::error('Blog Create Error', [
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Something went wrong while creating the blog.');
        }
    }

    public function edit($id)
    {
        Cache::tags(['blogs'])->flush();
        $blog =  Blog::with(['categories', 'tags', 'faqs'])->withTrashed()->findOrFail($id);
        $categories = Category::where('status', true)->get();
        $tags = BlogTags::where('blog_id', $id)->get();
        return view('admin.blogs.edit', compact('blog', 'categories', 'tags'));
    }
    public function update(Request $request, $id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'slug'                => 'required|string|max:255|unique:blog,slug,' . $blog->id,
            'feature_image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'feature_image_alt'   => 'nullable|string|max:255',
            'excerpt'             => 'nullable|string|max:500',
            'content'             => 'required|string',
            'meta_title'          => 'nullable|string|max:255',
            'meta_description'    => 'nullable|string|max:500',
            'keywords'            => 'nullable|string|max:255',
            'schema'              => 'nullable|string',
            'status'              => 'required|boolean',

            'category_id'         => 'nullable|array',
            'category_id.*'       => 'exists:categories,id',

            // 'tags'             => 'nullable|array',
            'tags.*'           => 'nullable|string',
            'question'   => 'nullable|array',
            'question.*' => 'nullable|string',

            'answer'     => 'nullable|array',
            'answer.*'   => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            //Upload New Image & Delete Old Image

         if ($request->hasFile('feature_image')) {
           if (!empty($blog->feature_image_public_id)) {

                try {

                    Cloudinary::uploadApi()->destroy(
                        $blog->feature_image_public_id,
                        [
                            'resource_type' => 'image',
                            'type'          => 'upload',
                        ]
                    );

                    Log::info('Old Cloudinary image deleted', [
                        'public_id' => $blog->feature_image_public_id,
                    ]);

                } catch (\Throwable $e) {

                    Log::warning('Could not delete old Cloudinary image', [
                        'public_id' => $blog->feature_image_public_id,
                        'error'     => $e->getMessage(),
                    ]);
                }
            }
            $file = $request->file('feature_image');

                $upload = Cloudinary::uploadApi()->upload(
                    $file->getRealPath(),
                    [
                        'folder' => 'Thefastbill/blog_images',
                        'public_id' => 'blog_image_' . time() . '_' . Str::random(8),
                        'overwrite' => false,
                        'resource_type' => 'image',
                    ]
                );

                // Save Cloudinary URL in database
                $validated['feature_image'] = $upload['secure_url'];

                // Optional: save Cloudinary public ID if your DB has a column
                $validated['feature_image_public_id'] = $upload['public_id'];
         }else{
            
            $validated['feature_image'] = $blog->feature_image;
            $validated['feature_image_public_id'] = $blog->feature_image_public_id;
         }


            //Update Blog


            $blog->update([
                'title'              => $validated['title'],
                'slug'               => $validated['slug'],
                'feature_image'      => $validated['feature_image'] ?? $blog->feature_image,
                'feature_image_public_id' => $validated['feature_image_public_id'] ?? $blog->feature_image_public_id,
                'feature_image_alt'  => $validated['feature_image_alt'] ?? null,
                'excerpt'            => $validated['excerpt'] ?? null,
                'content'            => $validated['content'],
                'meta_title'         => $validated['meta_title'] ?? null,
                'meta_description'   => $validated['meta_description'] ?? null,
                'keywords'           => $validated['keywords'] ?? null,
                'schema'             => $validated['schema'] ?? null,
                'status'             => $validated['status'],
            ]);

            // Update Categories


            BlogCategories::where('blog_id', $blog->id)->delete();

            if (!empty($validated['category_id'])) {

                $categoryData = [];

                foreach ($validated['category_id'] as $categoryId) {

                    $categoryData[] = [
                        'blog_id'     => $blog->id,
                        'category_id' => $categoryId,
                    ];
                }

                BlogCategories::insert($categoryData);
            }

            //Update Tags


            BlogTags::where('blog_id', $blog->id)->delete();

           $tags = array_filter($validated['tags'] ?? [],fn ($tag) => !is_null($tag) && trim($tag) !== '');

            if (!empty($tags)) {

                $tagData = [];

                foreach ($validated['tags'] as $tagName) {

                    $tagData[] = [
                        'blog_id' => $blog->id,
                        'tag_name'  => $tagName,
                    ];
                }

                BlogTags::insert($tagData);
            }
            //insert faq

            BlogFaq::where('blog_id', $blog->id)->delete();
            if (!empty($validated['question'])) {

                $faqData = [];

                foreach ($validated['question'] as $key => $question) {
                    if (
                        empty(trim($question ?? '')) &&
                        empty(trim($answer ?? ''))
                    ) {
                        continue;
                    }
                    $faqData[] = [
                        'blog_id'     => $blog->id,
                        'question'    => $question,
                        'answer'      => $validated['answer'][$key],
                    ];
                }
                if (!empty($faqData)) {
                    BlogFaq::insert($faqData);
                }
            }
            DB::commit();
            Cache::tags(['blogs'])->flush();
            return redirect()
                ->route('admin.blogs.index')
                ->with('success', 'Blog updated successfully.');
        } catch (\Exception $e) {

            DB::rollBack();

            Log::error('Blog Update Error', [
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Something went wrong while updating the blog.');
        }
    }
    public function destroy($id)
    {
        try {
            $blog = Blog::findorFail($id);
            if ($blog->feature_image && file_exists(public_path($blog->feature_image))) {
                unlink(public_path($blog->feature_image));
            }
            $blog->delete();
            Cache::tags(['blogs', 'trashed_blogs'])->flush();
            return redirect()->route('admin.blogs.index')->with('success', 'Blog deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
    public function trashed(Request $request)
    {

        // $blogs = Blog::onlyTrashed()->paginate(10);\
        $cacheKey = "blogs_trashed_" . md5($request->fullUrl());
        $data = Cache::tags(['trashed_blogs'])->remember($cacheKey, 600, function () use ($request) {
            $blogs = Blog::onlyTrashed()
                ->when($request->search, function ($query) use ($request) {

                    $query->where(function ($q) use ($request) {

                        $q->where('title', 'like', '%' . $request->search . '%')
                            ->orWhere('slug', 'like', '%' . $request->search . '%')
                            ->orWhere('content', 'like', '%' . $request->search . '%')
                            ->orWhere('meta_title', 'like', '%' . $request->search . '%')
                            ->orWhere('meta_description', 'like', '%' . $request->search . '%')
                            ->orWhere('keywords', 'like', '%' . $request->search . '%')
                            ->orWhere('schema', 'like', '%' . $request->search . '%')
                            ->orWhere('feature_image_alt', 'like', '%' . $request->search . '%');
                    });
                })
                ->paginate(10);
            return [
                'blogs' => $blogs
            ];
        });

        return view('admin.blogs.trashed', $data);
    }
    public function restore($id)
    {
        $blog = Blog::withTrashed()->findOrFail($id);
        if ($blog->trashed()) {
            $blog->restore();
            Cache::tags([
                'blogs',
                'trashed_blogs'
            ])->flush();
            return redirect()->route('admin.blogs.trash')->with('success', 'Blog restored successfully');
        } else {
            return redirect()->route('admin.blogs.trash')->with('error', 'Blog is not in trashed state');
        }
    }
    public function forceDelete($id)
    { //permanently delete
        try {
            $blog = Blog::withTrashed()->findOrFail($id);
            if ($blog->feature_image && file_exists(public_path($blog->feature_image))) {
                unlink(public_path($blog->feature_image));
            }
             if (!empty($blog->feature_image_public_id)) {

                try {

                    Cloudinary::uploadApi()->destroy(
                        $blog->feature_image_public_id,
                        [
                            'resource_type' => 'image',
                            'type'          => 'upload',
                        ]
                    );

                    Log::info('Old Cloudinary image deleted', [
                        'public_id' => $blog->feature_image_public_id,
                    ]);

                } catch (\Throwable $e) {

                    Log::warning('Could not delete old Cloudinary image', [
                        'public_id' => $blog->feature_image_public_id,
                        'error'     => $e->getMessage(),
                    ]);
                }
             }
            $blog->forceDelete();
            Cache::tags([
                'blogs',
                'trashed_blogs'
            ])->flush();
            return redirect()->route('admin.blogs.trash')->with('success', 'Blog permanently deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

     public function updateAdminUser($id,Request $request){
        $validated = $request->validate([
            'user_id' => 'required|exists:admin_users,id',
        ]);
        // dd($id, $validated);
        try {
            $blog = Blog::withTrashed()->findOrFail($id);
           $blog->created_by = $validated['user_id'];
            $blog->save();
            Cache::tags(['blogs'])->flush();
               return back()->with('success', 'Blog admin user updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
