<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tags;
use App\Models\BlogCategories;
use App\Models\BlogTags;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
class BlogController extends Controller
{
    public function index(){
        $blogs =  Blog::where('status',true)->paginate(10);
        return view('admin.blogs.index',compact('blogs'));
    }
    public function create(){
        $categories = Category::where('status',true)->get();
        $tags = Tags::where('status',true)->get();
        return view('admin.blogs.create', compact('categories', 'tags'));
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

        'tags_id'             => 'nullable|array',
        'tags_id.*'           => 'exists:tags,id',
    ]);
    // dd($validated);
    DB::beginTransaction();

    try {

        $validated['created_by'] = auth()->id();

        
        //Feature Image Upload
        
        if ($request->hasFile('feature_image')) {

            $file = $request->file('feature_image');

            $uploadPath = public_path('blogs/images');

            // Create folder if not exists
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }

            // Generate unique filename
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Move file
            $file->move($uploadPath, $filename);

            $validated['feature_image'] = 'blogs/images/' . $filename;
        }

        
        // Create Blog
        $blog = Blog::create([
            'title'              => $validated['title'],
            'slug'               => $validated['slug'],
            'feature_image'      => $validated['feature_image'] ?? null,
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
        Log::info('Blog Categories Debug', [
            'blog_id' => $blog->id,
            'category_ids' => $validated['category_id'] ?? null,
            'is_empty' => empty($validated['category_id'])
        ]);

        if (!empty($validated['category_id'])) {

            $categoryData = [];

            foreach ($validated['category_id'] as $categoryId) {
                $categoryData[] = [
                    'blog_id'     => $blog->id,
                    'category_id' => $categoryId,
                ];
            }

            Log::info('Category data prepared for insertion', [
                'category_data' => $categoryData
            ]);

            $result = BlogCategories::insert($categoryData);
            
            Log::info('Category insertion result', [
                'result' => $result,
                'inserted_count' => count($categoryData)
            ]);
        } else {
            Log::warning('No categories selected for blog', [
                'blog_id' => $blog->id
            ]);
        }

//Save Tags
     
        if (!empty($validated['tags_id'])) {

            $tagData = [];

            foreach ($validated['tags_id'] as $tagId) {
                $tagData[] = [
                    'blog_id' => $blog->id,
                    'tag_id'  => $tagId,
                ];
            }

            BlogTags::insert($tagData);
        }

        DB::commit();

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

    public function edit($id){
        $blog =  Blog::with('categories','tags')->findOrFail($id);
        $categories = Category::where('status',true)->get();
        $tags = Tags::where('status',true)->get();
        return view('admin.blogs.edit',compact('blog','categories','tags'));
    }
    public function update(Request $request, $id)
{
    $blog = Blog::findOrFail($id);

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

        'tags_id'             => 'nullable|array',
        'tags_id.*'           => 'exists:tags,id',
    ]);

    DB::beginTransaction();

    try {

        //Upload New Image & Delete Old Image
        

        if ($request->hasFile('feature_image')) {

            // Delete old image
            if ($blog->feature_image && File::exists(public_path($blog->feature_image))) {
                File::delete(public_path($blog->feature_image));
            }

            $file = $request->file('feature_image');

            $uploadPath = public_path('blogs/images');

            // Create directory if not exists
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }

            // New filename
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Upload image
            $file->move($uploadPath, $filename);

            $validated['feature_image'] = 'blogs/images/' . $filename;

        } else {

            // Keep old image
            $validated['feature_image'] = $blog->feature_image;
        }

        
        //Update Blog
        

        $blog->update([
            'title'              => $validated['title'],
            'slug'               => $validated['slug'],
            'feature_image'      => $validated['feature_image'],
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

        if (!empty($validated['tags_id'])) {

            $tagData = [];

            foreach ($validated['tags_id'] as $tagId) {

                $tagData[] = [
                    'blog_id' => $blog->id,
                    'tag_id'  => $tagId,
                ];
            }

            BlogTags::insert($tagData);
        }

        DB::commit();

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
public function destroy($id){
    try{
        $blog = Blog::findorFind($id);
        if($blog->feature_image && file_exists(public_path($blog->feature_image))){
            unlink(public_path($blog->feature_image));

    }
    $blog->delete();
    return redirect()->route('admin.blogs.index')->with('sucess','Blog deleted successfully');
    }catch(\Exception $e){
        return back()->with('error', $e->getMessage());
    }
}
public function trashedBlog(){
    $blogs = Blog::withTrashed()->where('status',true)->paginate(10);
    return view('admin.blogs.trashed',compact('blogs'));

}
public function restore($id){
    $blog = Blog::withTrashed()->findOrFail($id);
    if($blog->trashed()){
        $blog->restore();
        return redirect()->route('admin.blogs.trashed')->with('success','Blog restored ');
    }else{
        return redirect()->route('admin.blogs.trashed')->with('error','Blog is not in trashed state');
    }
}
public function delete($id){ //permanently delete
    try{
        $blog = Blog::withTrashed()->findOrFail($id);
        if($blog->feature_image && file_exists(public_path($blog->feature_image))){
            unlink(public_path($blog->feature_image));
        }
        $blog->forceDelete();
        return redirect()->route('admin.blogs.trashed')->with('success','Blog permanently deleted successfully');
    }catch(\Exception $e){
        return back()->with('error', $e->getMessage());
    }
}
}
