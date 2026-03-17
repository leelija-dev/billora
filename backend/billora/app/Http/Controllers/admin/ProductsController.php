<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
class ProductsController extends Controller
{
    public function index(Request $request)
    {
        try {
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::where('user_id', $user)->where('is_active', true)->paginate(15);
            if ($request->has('search')) {
                $product = Products::where('user_id', $user)->where('name', 'like', '%' . $request->search . '%')
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
             $user = Auth::user()->id;
            $data = $request->validate([
                // 'sku'                   => 'required|unique:products',
                'sku' => 'required|unique:products,sku,NULL,id,user_id,' . $user,
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
            ]);
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
           
            $data['user_id'] = $user;
            $data['created_by'] = $user;
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
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::where('user_id', $user)->where('id', $id)->first();
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
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::where('user_id', $user)->where('id', $id)->first();
            $data = $request->validate([
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
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::where('user_id', $user)->where('id', $id)->first();
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
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::withTrashed()->where('user_id',$user)->where('id',$id)->get();
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
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::withTrashed()->where('user_id',$user)->where('id',$id)->first();
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
