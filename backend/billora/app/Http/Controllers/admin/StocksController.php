<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stocks;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Customers;
use App\Models\Seller;
use App\Models\SellerProducts;
use App\Models\StockHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
class StocksController extends Controller
{

    public function index(Request $request)
    {
        try {
           
            $startTime = microtime(true);

            $customer =  Customers::findOrFail(Auth::user()->id);
            
             // check permission 
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();
            
            $hasStockPermission = in_array('stock-management', $permissions);

            $cacheKey = "stock_list_" . Auth::user()->id . "_" . md5($request->search . '_' . $request->page);
            
            $formCache = Cache::tags(['stock_user_' . Auth::user()->id.'_page_'.$request->page])->has($cacheKey);
            if ($hasStockPermission) {
                $user = Auth::user()->id; // authenticated user
                $search = $request->search;
                $stocks = Cache::tags(['stock_user_' . $user])->remember($cacheKey, 600, function () use ($user, $search) {
                     return Stocks::with('product')
                      ->where('user_id', $user)
                      ->when($search, function ($query) use ($search) {

                        $query->where(function ($q) use ($search) {
                            $q->where('id', 'like', "%$search%")
                                ->orWhere('selling_price', 'like', "%$search%")
                                ->orWhere('purchase_price', 'like', "%$search%")
                                ->orWhereHas('product', function ($q2) use ($search) {
                                    $q2->where('name', 'like', "%$search%");
                                });
                        });
                    })
                    ->orderBy('id','desc')
                    ->paginate(15);
                });
                $executionTime = microtime(true) - $startTime;
                return response()->json([
                    'status' => true,
                    'message' => 'Stock List',
                    'source' => $formCache ? 'Cache' : 'Database',
                    'response_time' => round($executionTime, 4) . ' sec',
                    'data' => $stocks
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function create()
    {
        try {
            // check permission 
            Cache::tags(['stock_user_' . Auth::user()->id.'_page_' ,1])->flush();
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                $user = Auth::user()->id;
                // cheeck active plan
                $customer =  Customers::findOrFail($user);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $products = Products::where('user_id', $user)->get();
                $units = Unit::where('user_id', $user)->get();
                return response()->json([
                    'status' => true,
                    'message' => 'Stock Create',
                    'data' => ['products' => $products, 'units' => $units]
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request)
    {
        $stocks = $request->validate([
            'product_id'        => 'required',
            'quantity'          => 'required',
            'selling_price'     => 'required',
            'product_package_id' => 'nullable',
            'purchase_price'    => 'nullable',
            'unit_id'           => 'nullable',
            'selling_gst_percentage' => 'nullable',
            'purchase_gst_percentage' =>'nullable',
            //seller products
            'seller_id'      => 'required',
            'gst_percentage' => 'nullable',
            'total_amount'   => 'nullable',
            'paid_amount'    => 'nullable',
            'invoice_number' => 'nullable',   
            'invoice_date'   => 'nullable',
            'invoice_image'  => 'nullable|image',

        ]);
        // Log::info('stock details: ' . json_encode($stocks));
        try {
            // check permission 
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                //check authenticated user
                if (!Auth::check()) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Authentication required. Please login first.'
                    ]);
                }
                $user = Auth::user()->id;
                //check active plan
                $customer =  Customers::findOrFail($user);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $stocks['user_id'] = $user;
                $stocks['created_by'] = $user;
                $stock = Stocks::create($stocks);
                $stockHistory = StockHistory::create([
                            'user_id' => $user,
                            'product_id'=> $stocks['product_id'],
                            'stock_id'=> $stock->id,
                            'quantity'=> $stocks['quantity'],
                            'created_by'=> $user,
                            'seller_id' => null,
                            'price' => $stocks['purchase_price'], // this is for purchase price 
                            'gst'  => null,
                            'discount' => null
                           
                        ]);
                /*---------------Seller Details---------------*/
                 $tempFile = null;

            if ($request->hasFile('invoice_image')) {
                $tempFile = $request->file('invoice_image')->getRealPath();
            }
                 if ($request->hasFile('invoice_image')) {
                Log::info('seller invoice image uploaded ');
                    $upload = Cloudinary::uploadApi()->upload(
                        $tempFile,
                        [
                            'folder' => 'Thefastbill/seller_products_invoices',
                            'public_id' => 'seller_'.$stocks['seller_id'] .'_'.'stock_id'.$stock->id,
                            'overwrite' => true,
                            'resource_type' => 'image'
                        ]
                    );
                }
                $sellerDetails = SellerProducts::create([
                            'user_id'    => $user,
                            'seller_id'  => $stocks['seller_id'],
                            'product_id' => $stocks['product_id'],
                            'stock_id'   => $stock->id,
                            'qty'        => $stocks['quantity'],
                            'purchase_price' => $stocks['purchase_price'],
                            'gst_percentage' => $stocks['gst_percentage'],
                            'total_amount'   => $stocks['total_amount'],
                            'paid_amount'    => $stocks['paid_amount'],
                            'invoice_number' => $stocks['invoice_number'],
                            'invoice_date'   => $stocks['invoice_date'],
                            'invoice_image'  => $upload['secure_url'] ?? null,
                            'invoice_image_public_url' =>$upload['public_id'] ?? null
                ]);
                // Log::info('Stock created: ' . json_encode($stock));
                $stocks = Stocks::where('user_id', $user)->get();
                Cache::tags(['stock_user_' . $user.'_page_'.$request->page ?? 1])->flush();
                // 'stock_user_' . Auth::user()->id.'page_id'.$request->page
                return response()->json([
                    'status' => true,
                    'message' => 'Stock created successfully',
                    'data' => $stocks
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
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
            //check authenticated user
            Cache::tags(['stock_user_' . Auth::user()->id.'_page_1'])->flush();
            
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            // check permission 
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                $user = Auth::user()->id;
                //check active plan
                $customer =  Customers::findOrFail($user);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }

                $stock = Stocks::where('user_id', $user)->where('id', $id)->first();
                return response()->json([
                    'status' => true,
                    'message' => 'edit/show stock',
                    'data' => $stock
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($id, Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            // check permission 
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                $user = Auth::user()->id;
                //check active plan
                $customer =  Customers::findOrFail($user);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $data = $request->validate([
                    'product_id'    => 'required',
                    'purchase_price' => 'nullable',
                    'purchase_gst_percentage' => 'nullable',
                    'selling_gst_percentage' => 'nullable',
                    'selling_price' => 'required',
                    'unit_id'       => 'required',
                    'quantity'      => 'required',
                ]);
                // $product = Products::findOrFail($data['product_id']);
                // if(!$product){
                //     return response()->json([
                //         'status' => false,
                //         'message' => 'Product not found'
                //     ]);
                // }
                // Log::info('stock id'.$id);
                // Log::info('Updating stock id: ' . $id);
                // Log::info('stock data: ' . json_encode($data));
                $stock = Stocks::where('user_id', $user)->where('id', $id)->first();

                $stock->update($data);
                $seller = Seller::where('user_id',$user)->where('id',$request->seller_id)->first();
                $sellerProducts = SellerProducts::where('user_id',$user)->where('seller_id',$request->seller_id)->where('stock_id',$stock->id)->first();
                if(!$seller){
                   return response()->json([
                    'status' => false,
                    'message' => 'Seller not found.Please select valid seller!'
                   ]); 
                }

                if($request->deleted_image_id){
                    $this->deleteFromCloudinary($stock->invoice_image_public_url);
                    $sellerProducts->update([
                        'invoice_image' => null,
                        'invoice_image_public_url' => null
                        
                        ]);
                        
                }
                $tempFile = null;
                if ($request->hasFile('invoice_image')) {
                    $tempFile = $request->file('invoice_image')->getRealPath();
                }
                 if ($request->hasFile('invoice_image')) {
                Log::info('seller invoice image uploaded ');
                    $upload = Cloudinary::uploadApi()->upload(
                        $tempFile,
                        [
                            'folder' => 'Thefastbill/seller_products_invoices',
                            'public_id' => 'seller_'.$stock['seller_id'] .'_'.'stock_id'.$stock->id,
                            'overwrite' => true,
                            'resource_type' => 'image'
                        ]
                    );
                }
                $sellerProducts->update([
                    'stock_id'                  => $stock->id,
                    'seller_id'                 => $seller->id,
                    'qty'                       => $data['quantity'],
                    'product_id'                => $data['product_id'],
                    'purchase_price'            => $data['purchase_price'],
                    'gst_percentage'            => $data['purchase_gst_percentage'],
                    'total_amount'              => $data['total_amount'],
                    'paid_amount'               => $data['paid_amount'],
                    'invoice_number'            => $data['invoice_number'],
                    'invoice_date'              => $data['invoice_date'],
                    'invoice_image'             => $upload['secure_url'] ?? null,
                    'invoice_image_public_url'  =>$upload['public_id'] ?? null
                ]);
                // Log::info('Stock updated: ' . json_encode($stock));
                // $product->update([
                //     'selling_price' => $data['selling_price'],
                //     'purchase_price' => $data['purchase_price']
                // ]);
                // Cache::tags(['stock_user_' . $user,'products_user_'.$user])->flush();
                 Cache::tags(['stock_user_' . $user.'_page_'.$request->page ?? 1,'products_user_'.$user])->flush();
                return response()->json([
                    'status' => true,
                    'message' => 'edit stock',
                    'data' => $stock
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    private function deleteFromCloudinary($publicId)
    {
        if ($publicId) {
            // Cloudinary::destroy($publicId);
            Cloudinary::uploadApi()->destroy($publicId);
        }
    }
    public function destroy(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'user_id' => 'required'
            ]);
            $user_id = $data['user_id'];
            //check authenticated user
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            // check permission 
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                //check active plan
                $customer =  Customers::findOrFail($user_id);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $user = Auth::user()->id;
                $stock = Stocks::where('id', $id)
                    ->where('user_id', $user_id)
                    ->firstOrFail();
                $stock->delete();
                Cache::tags(['stock_user_' . Auth::user()->id.'_page_' ,$request->page ?? 1,'products_user_'.$user])->flush();
                // Cache::tags(['stock_user_' . Auth::user()->id.'_page_' ,1])->flush();
                return response()->json([
                    'status' => true,
                    'message' => 'Stock Deleted Successfully',
                    'data' => $stock
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function addStock(Request $request, $id)
    {
        $data = $request->validate([
            'quantity' => 'required',
            'user_id' => 'required',
        ]);
        try {
            //check authenticated user
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            // check permission 
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            if ($hasStockPermission) {
                $user = Auth::user()->id;
                //check active plan
                $customer =  Customers::findOrFail($user);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $stock = Stocks::where('id', $id)
                    ->where('user_id', $data['user_id'])
                    ->first();

                $stock->update([
                    'quantity' => ((float)$stock->quantity + (float)$data['quantity']),
                ]);
                $stockHistory = StockHistory::create([
                            'user_id' => $user,
                            'product_id'=> $stock->product_id,
                            'stock_id'=> $stock->id,
                            'quantity'=> $data['quantity'],
                            'created_by'=> $user
                ]);
                Cache::tags(['stock_user_' . Auth::user()->id.'_page_' ,$request->page ?? 1,'products_user_'.$user])->flush();
                
                return response()->json([
                    'status' => true,
                    'message' => 'Stock Updated Successfully',
                    'data' => $stock
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function stockalert($id){
        $user =  Auth::user()->id;
        if(!Auth::check()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        if($id != $user){
            return response()->json([
                'status' => false,
                'message' => ' Invalid user.You do not have permission to access stock management!'
            ]);
        }
        $customer =  Customers::findOrFail($user);
        
    }
}
