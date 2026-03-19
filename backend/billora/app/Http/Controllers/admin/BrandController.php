<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class BrandController extends Controller
{
  public function index(Request $request)
{
    try {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }

        $user = Auth::user()->id;
        
        // SIMPLE TEST - No search, no complex queries
        $brands = Brand::where('user_id', $user)->get();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Your Brand List',
            'user_id' => $user,
            'data' => $brands
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user=Auth::user()->id;
        $brand = $request->validate([
            
            'name'          => 'required',
            'is_active'     => 'nullable',
            'description'   => 'nullable',

        ]);
        $brand['user_id'] = $user;
        $brand['created_by']  = $user;

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
         if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user =Auth::user()->id;
        try {
            $brand = Brand::where('id',$id)->where('user_id',$user)->get();
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
     if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
    try {
        $user = Auth::user()->id;
        $brand = Brand::where('id',$id)->where('user_id',$user)->first();
        $validated = $request->validate([
            'name'          => 'required',
            'is_active'     => 'nullable|boolean',
            'description'   => 'nullable',
        ]);
        $validated['user_id'] =  $user;
        $validated['created_by']  =  $user;
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
             if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
            }
            $user =Auth::user()->id;
            $brand = Brand::where('id',$id)->where('user_id',$user);
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
