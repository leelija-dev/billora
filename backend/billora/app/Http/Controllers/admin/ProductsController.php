<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $product = Products::where('is_active', true)->paginate(15);
            if ($request->has('search')) {
                $product = Products::where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%')
                    ->orWhere('category_id', 'like', '%' . $request->search . '%')
                    ->orWhere('brand_id', 'like', '%' . $request->search . '%')
                    ->orWhere('unit_id', 'like', '%' . $request->search . '%')
                    ->orWhere('unit_amount', 'like', '%' . $request->search . '%')
                    ->where('is_active', true)->paginate(10);
            }
            return response()->json([
                'status' => true,
                'message' => 'Product List',
                'data' => $product
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
        try {
            $data = $request->validate([
                'user_id'               => 'required',
                'sku'                   => 'required|unique:products',
                'name'                  => 'required',
                'brand_id'              => 'nullable|exists:brand,id',
                'category_id'           => 'required',
                'unit_amount'           => 'required',
                'unit_id'               => 'required|exists:unit,id',
                'selling_price'         => 'nullable',
                'purchase_price'        => 'nullable',
                'gst_percentage'        => 'nullable',
                'discount_percentage'   => 'nullable',
                'description'           => 'nullable',
                'is_active'             => 'required',
                'created_by'            => 'nullable'
            ]);
            $product = Products::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Product Created Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function show($id)
    {
        try {
            $product = Products::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'Single product',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update($id, Request $request)
    {   // update product
        try {
            $product = Products::findOrFail($id);
            $data = $request->validate([
                'user_id'               => 'required',
                'name'                  => 'required',
                'brand_id'              => 'nullable',
                'category_id'           => 'required',
                'unit_amount'           => 'required',
                'unit_id'               => 'required',
                'selling_price'         => 'nullable',
                'purchase_price'        => 'nullable',
                'gst_percentage'        => 'nullable',
                'discount_percentage'   => 'nullable',
                'description'           => 'nullable',
                'is_active'             => 'required',
                'created_by'            => 'nullable'
            ]);
            $product->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Product Updated Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function destroy($id)
    {
        try {
            $product = Products::findOrFail($id);
            $product->delete();
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function restore($id)
    {
        try {
            $product = Products::withTrashed()->findOrFail($id);
            $product->restore();
            return response()->json([
                'status' => true,
                'message' => 'Product Restored Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function forceDelete($id)
    {
        try {
            $product = Products::withTrashed()->findOrFail($id);
            $product->forceDelete();
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Permanently',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
