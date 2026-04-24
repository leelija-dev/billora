<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tags;
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
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:blogs,slug',
        'feature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'feature_image_alt' => 'nullable|string|max:255',
        'excerpt' => 'nullable|string|max:255',
        'content' => 'required|string',
        'meta_title' => 'nullable|string|max:255',
        'meta_description' => 'nullable|string',
        'meta_tag' => 'nullable|string|max:255',
        'keywords' => 'nullable|string|max:255',
        'schema' => 'nullable|string',
        'status' => 'required|boolean'
    ]);

    try {
        $data['created_by'] = auth()->id();

        // image Upload
        if ($request->hasFile('feature_image')) {

            $file = $request->file('feature_image');

            $path = public_path('blogs/images');

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move($path, $filename);

            $data['feature_image'] = 'blogs/images/' . $filename;
        }

        Blog::create($data);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog created successfully');

    } catch (\Exception $e) {
        return back()->with('error', $e->getMessage());
    }
}
    public function edit($id){
        $blogs =  Blog::with('categories','tags')->findOrFail($id);
        $categories = Category::where('status',true)->get();
        $tags = Tags::where('status',true)->get();
        return view('admin.blogs.edit',compact('blogs','categories','tags'));
    }
    public function update(Request $request, $id)
{
    $blog = Blog::findOrFail($id);

    $data = $request->validate([
        'title' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:blogs,slug,' . $id,
        'feature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'feature_image_alt' => 'nullable|string|max:255',
        'excerpt' => 'nullable|string|max:255',
        'content' => 'required|string',
        'meta_title' => 'nullable|string|max:255',
        'meta_description' => 'nullable|string',
        'meta_tag' => 'nullable|string|max:255',
        'keywords' => 'nullable|string|max:255',
        'schema' => 'nullable|string',
        'status' => 'required|boolean'
    ]);

    try {

        //  Update
        if ($request->hasFile('feature_image')) {

            // delete old image
            if ($blog->feature_image && file_exists(public_path($blog->feature_image))) {
                unlink(public_path($blog->feature_image));
            }

            $file = $request->file('feature_image');

            $path = public_path('blogs/images');

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move($path, $filename);

            $data['feature_image'] = 'blogs/images/' . $filename;
        }

        $blog->update($data);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog updated successfully');

    } catch (\Exception $e) {
        return back()->with('error', $e->getMessage());
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
