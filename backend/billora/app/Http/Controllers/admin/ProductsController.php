<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\Categories;
use App\Models\Stocks;
use App\Models\Customers;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        try {
            if (!Auth::check()) {
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
    public function create($id)
    {
        $user = Auth::user()->id;
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        if ($user != $id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authenticated user!'
            ]);
        }
        try {
            $customer = Customers::findOrFail($id);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }

            $brand = Brand::where('user_id', $id)->get();
            $category = Categories::where('user_id', $id)->get();
            $unit = Unit::where('user_id', $id)->get();
            return response()->json([
                'status' => true,
                'message' => 'Product Create',
                'brand' => $brand,
                'category' => $category,
                'unit' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    private function uploadToDrive($file,$folderId)
    {
        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->refreshToken(env('GOOGLE_REFRESH_TOKEN'));

        $service = new Drive($client);

        $fileMetadata = new DriveFile([
            'name' => time() . '_' . $file->getClientOriginalName(),
            'parents' => [$folderId]
        ]);

        $uploadedFile = $service->files->create($fileMetadata, [
            'data' => file_get_contents($file->getRealPath()),
            'mimeType' => $file->getMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id'
        ]);

        $fileId = $uploadedFile->id;

        // Make file public
        $permission = new Permission([
            'type' => 'anyone',
            'role' => 'reader'
        ]);

        $service->permissions->create($fileId, $permission);

        return "https://drive.google.com/uc?export=view&id=" . $fileId;
    }
    public function store(Request $request)
    {
        try {
            $user = Auth::user()->id;
            
            $data = $request->validate([
                // 'sku'                   => 'required|unique:products',
                'user_id'              => 'nullable',
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
                'image'                 => 'nullable',
                'qr_code'               => 'nullable'
            ]);
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
           //  Upload Image → images folder
        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToDrive(
                $request->file('image'),
                env('GOOGLE_IMAGE_FOLDER_ID')
            );
        }

        //  Upload QR → qr_codes folder
        if ($request->hasFile('qr_code')) {
            $data['qr_code'] = $this->uploadToDrive(
                $request->file('qr_code'),
                env('GOOGLE_QR_FOLDER_ID')
            );
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
            if (!Auth::check()) {
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
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }

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
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
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
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            // check active plan
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->get();
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
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            // check active plan
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->first();
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

    /* public user show products */
    public function userProducts(Request $request, $id)
    {
        try {

            // $products = Products::with('brand','category','unit')->where('user_id', $id)->where('is_active',true)->paginate(15);
            $categoies = Categories::where('user_id', $id)->where('is_active', true)->get();
            $brands = Brand::where('user_id', $id)->where('is_active', true)->get();
            $store = Store::where('user_id', $id)->get();
            $products = Products::with('brand', 'category', 'unit')
                ->where('user_id', $id)
                ->where('is_active', true)
                ->when($request->search, function ($query) use ($request) {

                    $search = $request->search;

                    $query->where(function ($q) use ($search) {

                        // Product name
                        $q->where('name', 'like', "%{$search}%")

                            // SKU
                            ->orWhere('sku', 'like', "%{$search}%")

                            // Price
                            ->orWhere('selling_price', 'like', "%{$search}%")

                            // Category name
                            ->orWhereHas('category', function ($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            })

                            // Brand name
                            ->orWhereHas('brand', function ($q) use ($search) {
                                $q->where('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->paginate(15);
            if (!$products) {
                return response()->json([
                    'status' => false,
                    'message' => 'Product not found!'
                ]);
            }
            return response()->json([
                'status' => true,
                'categories' => $categoies,
                'brands' => $brands,
                'stores' => $store,
                'products' => $products

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function categoryProducts(Request $request, $id)
    {
        try {

            $user_id = $request->user_id;

            $products = Products::with('brand', 'category', 'unit')->where('category_id', $id)->where('user_id', $user_id)->paginate(15);

            if (!$products) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Product not found!'
                ]);
            }
            return response()->json([
                'status' => true,
                'products' => $products,

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
