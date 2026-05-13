<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Testimonials;

class TestimonialsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $testimonials = Testimonials::when($search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('role', 'like', '%' . $search . '%')
                ->orWhere('company', 'like', '%' . $search . '%')
                ->orWhere('message', 'like', '%' . $search . '%');
        })
            ->latest()
            ->paginate(15)
            ->withQueryString();
        $totalTestimonials = Testimonials::count();
        $activeTestimonials = Testimonials::where('is_active', true)->count();
        $inactiveTestimonials = Testimonials::where('is_active', false)->count();
        return view('admin.testimonial.index', compact('testimonials','totalTestimonials','activeTestimonials','inactiveTestimonials'));
    }
    public function create()
    {
        return view('admin.testimonial.create');
    }
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'role' => 'required|string|max:255',
                'company' => 'nullable|string|max:255',
                'message' => 'nullable|string',
                'rating' => 'required|min:1|max:5',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
                'shop_type' => 'nullable|string|max:255',
            ]);
            // dd($data);
            if ($request->hasFile('image')) {

                $file = $request->file('image');

                // Folder path
                $destinationPath = public_path('images/testimonials');

                // Create folder if not exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                // Unique file name
                $filename = time() . '_' . $file->getClientOriginalName();

                // Move file to public/images/testimonials
                $file->move($destinationPath, $filename);

                // Save path in DB
                $data['image'] = 'images/testimonials/' . $filename;
            }
            Testimonials::create($data);
            return redirect()->route('admin.testimonial.index')->with('success', 'Testimonial created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while creating the testimonial: ' . $e->getMessage());
        }
    }
    public function edit($id)
    {
        $testimonial = Testimonials::findOrFail($id);
        return view('admin.testimonial.edit', compact('testimonial'));
    }
    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonials::findOrFail($id);

            // Validation
            $data = $request->validate([
                'name'       => 'required|string|max:255',
                'role'       => 'required|string|max:255',
                'company'    => 'nullable|string|max:255',
                'message'    => 'nullable|string',
                'rating'     => 'required|integer|min:1|max:5',
                'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'shop_type'  => 'nullable|string|max:255',
                'is_active'  => 'nullable|boolean',
            ]);

            // Handle checkbox
            // $data['is_active'] = $request->has('is_active') ? 1 : 0;

            //Image Upload
            if ($request->hasFile('image')) {

                $file = $request->file('image');

                // Folder path
                $destinationPath = public_path('images/testimonials');

                // Create folder if not exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                //Delete old image
                if ($testimonial->image && file_exists(public_path($testimonial->image))) {
                    unlink(public_path($testimonial->image));
                }

                // Unique filename
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Move file
                $file->move($destinationPath, $filename);

                // Save new path
                $data['image'] = 'images/testimonials/' . $filename;
            }

            //Update record
            $testimonial->update($data);

            return redirect()
                ->route('admin.testimonial.index')
                ->with('success', 'Testimonial updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error: ' . $e->getMessage());
        }
    }
    public function delete($id)
    {
        try {
            $testimonial = Testimonials::findOrFail($id);
            $testimonial->delete();
            return redirect()->route('admin.testimonials.index')->with('success', 'Testimonial deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while deleting the testimonial: ' . $e->getMessage());
        }
    }
}
