<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->search;

            $brands = Brand::where('name', 'like', "%$search%")
            ->orWhere('id', 'like', "%$search%")
            ->orWhere('description', 'like', "%$search%")
            ->orWhere('slug', 'like', "%$search%")
            ->paginate(15);
            return response()->json([
                'status' => 'success',
                'message' => 'Brand List',
                'data' => $brands
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request)
    {
        $brand = $request->validate([
            'user_id'       => 'required',
            'name'          => 'required',
            'created_by'    => 'nullable',
            'is_active'     => 'nullable',
            'description'   => 'nullable',

        ]);
        try {
            $brand['slug'] = Str::slug($brand['name']);
            $brand = Brand::create($brand);
            return response()->json([
                'status' => 'success',
                'message' => 'Brand Created Successfully',
                'data' => $brand
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function edit($id)
    {
        try {
            $brand = Brand::findOrFail($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Brand Details',
                'data' => $brand
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $id)
{
    try {
        $brand = Brand::findOrFail($id);
        
        $validated = $request->validate([
            'user_id'       => 'required',
            'name'          => 'required',
            'created_by'    => 'nullable',
            'is_active'     => 'nullable|boolean',
            'description'   => 'nullable',
        ]);

        // Update slug when name changes
        $validated['slug'] = Str::slug($validated['name']);
        
        $brand->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Brand Updated Successfully',
            'data' => $brand
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
    public function delete($id)
    {
        try {
            $brand = Brand::findOrFail($id);
            $brand->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Brand Deleted Successfully',
                'data' => $brand
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
