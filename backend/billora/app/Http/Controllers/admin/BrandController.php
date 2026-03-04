<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index()
    {
        try {
            $brands = Brand::all();
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
            'user_id' => 'required',
            'name' => 'required',
            'created_by' => 'nullable',
            'is_active' => 'nullable',
            'description' => 'nullable',

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
    public function update($id, Request $request)
    {
        $brand = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'created_by' => 'nullable',
            'is_active' => 'nullable',
            'description' => 'nullable',
        ]);
        try {
            $brand = Brand::findOrFail($id);
            $brand->update($brand);
            return response()->json([
                'status' => 'success',
                'message' => 'Brand Updated Successfully',
                'data' => $brand
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
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
