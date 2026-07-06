<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stocks;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Customers;
use App\Models\Seller;
use App\Models\SellerPaymentHistory;
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

            $search = $request->search;
            $stock = $request->stock;
            $product = $request->product;
            $seller = $request->seller;
            if ($search) {
                $search = strtolower($search);
                $search = str_replace(['-', "'", "’"], [' ', '', ''], $search);
            }

            if ($product) {
                $product = strtolower($product);
                $product = str_replace(['-', "'", "’"], [' ', '', ''], $product);
            }
            // check permission 
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);
            $page = $request->page ?? 1;
            // $cacheKey = "stock_list_" . Auth::user()->id . "_" . md5($search . '_' .$product.'_'.$seller.'_'. $page);
            $cacheKey = "stock_list_" . Auth::user()->id . "_" . md5(json_encode([
                'search' => $search,
                'stock' => $stock,
                'product' => $product,
                'seller' => $seller,
                'page' => $page,
            ]));

            $formCache = Cache::tags(['stock_user_' . Auth::user()->id])->has($cacheKey);
            if ($hasStockPermission) {
                $user = Auth::user()->id; // authenticated user

                $stocks = Cache::tags(['stock_user_' . $user])->remember($cacheKey, 600, function () use ($user, $search, $stock, $product, $seller) {
                    return Stocks::with('product', 'product.unit', 'sellerProduct')
                        ->where('user_id', $user)
                        ->when($search, function ($query) use ($search) {

                            $query->where(function ($q) use ($search) {
                                $q->where('id', 'like', "%$search%")
                                    ->orWhere('selling_price', 'like', "%$search%")
                                    ->orWhere('purchase_price', 'like', "%$search%")
                                    ->orWhereHas('product', function ($q2) use ($search) {
                                        // $q2->where('name', 'like', "%$search%");
                                        $q2->whereRaw(
                                            "LOWER(REPLACE(REPLACE(name, '''', ''), '’', '')) LIKE ?",
                                            ["%{$search}%"]
                                        );
                                        
                                    });
                            });
                        })
                        ->when(!empty($stock), function ($query) use ($stock) {

                            if ($stock == 'low-stock') {
                                $query->whereBetween('quantity', [1, 5]);
                            } elseif ($stock == 'out-of-stock') {
                                $query->where('quantity', 0);
                            } elseif ($stock == 'in-stock') {
                                $query->where('quantity', '>', 0);
                            }
                        })
                        ->when(!empty($product), function ($query) use ($product) {
                            $product = str_replace(["'", "’"], "", strtolower($product));
                            $query->whereHas('product', function ($q) use ($product) {
                                // $q->where('name', 'like', "%$product%");
                                $q->whereRaw(
                                    "LOWER(REPLACE(REPLACE(name, '''', ''), '’', '')) LIKE ?",
                                    ["%{$product}%"]
                                );
                            });
                        })
                        ->when(!empty($seller), function ($query) use ($seller) {
                            $seller = str_replace(["'", "’"], "", strtolower($seller));
                            $query->whereHas('sellerProduct.seller', function ($q) use ($seller) {
                                $q->whereRaw(
                                    "LOWER(REPLACE(REPLACE(name, '''', ''), '’', '')) LIKE ?",
                                    ["%{$seller}%"]
                                );
                            });
                        })
                        ->orderBy('id', 'desc')
                        ->paginate(8);
                });
                $executionTime = microtime(true) - $startTime;
                return response()->json([
                    'status' => true,
                    'message' => 'Stock List',
                    'source' => $formCache ? 'Cache' : 'Database',
                    'source1' => $formCache,
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
            Cache::tags(['stock_user_' . Auth::user()->id])->flush();
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
            'purchase_gst_percentage' => 'nullable',
            //seller products
            'seller_id'      => 'nullable',
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
                    'product_id' => $stocks['product_id'],
                    'stock_id' => $stock->id,
                    'quantity' => $stocks['quantity'],
                    'created_by' => $user,
                    'seller_id' => $stocks['seller_id'],
                    'price' => $stocks['purchase_price'], // this is for purchase price 
                    'gst'  => $stocks['purchase_gst_percentage'],
                    'discount' => 0

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
                            'public_id' => 'seller_' . $stocks['seller_id'] . '_' . 'stock_id' . $stock->id,
                            'overwrite' => true,
                            'resource_type' => 'image'
                        ]
                    );
                }
                $seller = Seller::findOrFail($stocks['seller_id']);
                if (!$seller) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Seller not found'
                    ]);
                }
                $totalAmt = (($stocks['purchase_price'] * $stocks['quantity']) + ($stocks['purchase_price'] * $stocks['quantity'] * $stocks['purchase_gst_percentage'] / 100));
                $sellerDetails = SellerProducts::create([
                    'user_id'    => $user,
                    'seller_id'  => $stocks['seller_id'],
                    'product_id' => $stocks['product_id'],
                    'stock_id'   => $stock->id,
                    'qty'        => $stocks['quantity'] ?? 0,
                    'purchase_price' => $stocks['purchase_price'] ?? 0,
                    'gst_percentage' => $stocks['purchase_gst_percentage'] ?? 0,
                    'total_amount'   => $totalAmt, //$stocks['total_amount'] ?? 0,
                    'paid_amount'    => $stocks['paid_amount'] ?? 0,
                    'invoice_number' => $stocks['invoice_number'] ?? 0,
                    'invoice_date'   => $stocks['invoice_date'] ?? 0,
                    'invoice_image'  => $upload['secure_url'] ?? null,
                    'invoice_image_public_url' => $upload['public_id'] ?? null
                ]);
                if ($stocks['paid_amount'] > 0) {
                    SellerPaymentHistory::create([
                        'user_id'           => $user,
                        'seller_id'         => $stocks['seller_id'],
                        'invoice_id'        => $stocks['invoice_number'] ?? 0,
                        'paid_amount'       => $stocks['paid_amount'] ?? 0,
                        'payment_method'    => 'cash',
                        'remarks'           => 'Stock purchase'
                    ]);
                }
                if ($seller) {
                    $seller->update([
                        'due_amount' => $seller->due_amount + ($totalAmt - $stocks['paid_amount'])
                    ]);
                }
                $stock->update([
                    'seller_product_id' => $sellerDetails->id
                ]);
                // Log::info('Stock created: ' . json_encode($stock));
                $stocks = Stocks::where('user_id', $user)->get();
                Cache::tags(['stock_user_' . $user, 'gst_collection_user_' . $user, 'billing_user_' . $user, 'seller_user_' . $user])->flush();
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
            Cache::tags(['stock_user_' . Auth::user()->id])->flush();

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

                $stock = Stocks::where('user_id', $user)->where('id', $id)->with('seller_product_id')->first();
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
                    'seller_id'     => 'required',
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
                if (!$stock) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Stock not found'
                    ]);
                }
                $stock->update($data);
                $seller = Seller::where('user_id', $user)
                    ->where('id', $request->seller_id)
                    ->first();

                if (!$seller) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Seller not found. Please select a valid seller!'
                    ]);
                }

                $tempFile = null;
                $upload = [];

                if ($request->hasFile('invoice_image')) {
                    $tempFile = $request->file('invoice_image')->getRealPath();

                    Log::info('seller invoice image uploaded');

                    $upload = Cloudinary::uploadApi()->upload(
                        $tempFile,
                        [
                            'folder' => 'Thefastbill/seller_products_invoices',
                            'public_id' => 'seller_' . $seller->id . '_stock_id_' . $stock->id,
                            'overwrite' => true,
                            'resource_type' => 'image'
                        ]
                    );
                }

                $sellerProducts = SellerProducts::where('user_id', $user)
                    ->where('seller_id', $seller->id)
                    ->where('stock_id', $stock->id)
                    ->first();
                $prePaid = 0;
                if ($sellerProducts) {
                    $prePaid = $sellerProducts->paid_amount;
                }
                if ($request->deleted_image_id && $sellerProducts) {
                    if ($sellerProducts->invoice_image_public_url) {
                        $this->deleteFromCloudinary($sellerProducts->invoice_image_public_url);
                    }

                    $sellerProducts->update([
                        'invoice_image' => null,
                        'invoice_image_public_url' => null
                    ]);
                }

                $sellerProducts = SellerProducts::updateOrCreate(
                    [
                        'user_id'   => $user,
                        'seller_id' => $seller->id,
                        'stock_id'  => $stock->id,
                    ],
                    [
                        'qty'                      => $data['quantity'],
                        'product_id'               => $data['product_id'],
                        'purchase_price'           => $data['purchase_price'] ?? 0,
                        'gst_percentage'           => $data['purchase_gst_percentage'] ?? 0,
                        'total_amount'             => $request->total_amount ?? 0,
                        'paid_amount'              => is_numeric($request->paid_amount) ? $request->paid_amount : 0,
                        'invoice_number'           => $request->invoice_number,
                        'invoice_date'             => $request->invoice_date,
                        'invoice_image'            => $upload['secure_url'] ?? ($sellerProducts->invoice_image ?? null),
                        'invoice_image_public_url' => $upload['public_id'] ?? ($sellerProducts->invoice_image_public_url ?? null),
                    ]
                );
                // $sellerProducts
                if ($seller) {
                    $new = (float)$prePaid - (float)$request->paid_amount;
                    $seller->update([
                        'due_amount' => (float)$seller->due_amount + (float)$new
                    ]);
                }
                $stock->update([
                    'seller_id' => $sellerProducts->seller_id,
                    'seller_product_id' => $sellerProducts->id
                ]);
                $stockHistory = StockHistory::where('stock_id', $stock->id)->where('user_id', $user)->get();
                foreach ($stockHistory as $history) {
                    $history->update([
                        'price' => $stock->purchase_price,
                        'gst' => $stock->purchase_gst_percentage
                    ]);
                }

                Cache::tags([
                    'stock_user_' . $user,
                    'products_user_' . $user,
                    'gst_collection_user_' . $user,
                    'billing_user_' . $user,
                    'seller_user_' . $user
                ])->flush();

                return response()->json([
                    'status' => true,
                    'message' => 'Stock updated successfully',
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
                Cache::tags(['stock_user_' . Auth::user()->id, 'products_user_' . $user])->flush();
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
                if ($stock) {
                    $stock->update([
                        'quantity' => ((float)$stock->quantity + (float)$data['quantity']),
                    ]);
                }
                $stockHistory = StockHistory::create([
                    'user_id' => $user,
                    'product_id' => $stock->product_id,
                    'stock_id' => $stock->id,
                    'seller_id' => $stock->seller_id ? $stock->seller_id : null,
                    'price' => $stock->purchase_price ? $stock->purchase_price : 0,
                    'gst' => $stock->purchase_gst_percentage ? $stock->purchase_gst_percentage : 0,
                    'quantity' => $data['quantity'],
                    'created_by' => $user
                ]);
                $sellerProduct = SellerProducts::where('seller_id', $stock->seller_id)->where('stock_id', $stock->id)->where('user_id', $user)->first();
                $seller = Seller::where('id', $stock->seller_id)->first();
                if ($sellerProduct) {
                    $sellerProduct->update([
                        'qty' => ((float)$sellerProduct->qty + (float)$data['quantity'])
                    ]);
                }
                if ($seller) {
                    $seller->update([
                        'due_amount' => ((float)$seller->due_amount + ((float)$stock->purchase_price * (float)$data['quantity']) + (float)$data['quantity'] * ((float)$stock->purchase_price * (float)$stock->purchase_gst_percentage / 100))
                    ]);
                }
                Cache::tags(['stock_user_' . Auth::user()->id, 'products_user_' . $user, 'gst_collection_user_' . $user, 'billing_user_' . $user])->flush();
                // 'stock_user_' . Auth::user()->id.'_page_'.$request->page
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
    // stock alert send from customer controller login function
    // public function stockalert($id)  
    // {
    //     $user =  Auth::user()->id;
    //     if (!Auth::check()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Authentication required. Please login first.'
    //         ]);
    //     }
    //     if ($id != $user) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => ' Invalid user.You do not have permission to access stock management!'
    //         ]);
    //     }
    //     $customer =  Customers::findOrFail($user);
    // }
    public function stockRemove(Request $request, $id)
    {
        $data = $request->validate([
            'user_id' => 'required',
            'quantity' => 'required',


        ]);
        $user = Auth::user()->id;
        if ($data['user_id'] != $user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        DB::beginTransaction();
        try {
            $customer =  Customers::findOrFail(Auth::user()->id);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);
            if ($hasStockPermission) {
                $stock = Stocks::where('id', $id)->where('user_id', $data['user_id'])->first();
                if (!$stock) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Stock not found'
                    ]);
                }
                if ($data['quantity']  <= 0) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Delete stock can less than 0 or equal to 0'
                    ]);
                }
                if ($stock->quantity < $data['quantity']) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Delete stock can not greater than current stock quantity'
                    ]);
                }
                if ($stock->quantity >= $data['quantity']) {
                    $stock->update([
                        'quantity' => ((float)$stock->quantity - (float)$data['quantity']),
                    ]);
                    $sellerProducts = SellerProducts::where('seller_id', $stock->seller_id)->where('stock_id', $stock->id)->where('product_id', $stock->product_id)->orderBy('id', 'desc')->get();
                    $removeQty = $data['quantity'];

                    if ($sellerProducts->isNotEmpty()) {
                        foreach ($sellerProducts as $seller) {
                            if ($removeQty <= 0) {
                                break;
                            }
                            $availableQty = $seller->qty;
                            if ($availableQty <= $removeQty) {

                                // Remove all quantity from this record
                                $seller->update([
                                    'qty' => 0
                                ]);

                                $removeQty -= $availableQty;
                            } else {
                                $userSeller = Seller::where('id', $seller->seller_id)->where('user_id', $data['user_id'])->first();
                                // Remove only required quantity
                                $seller->update([
                                    'qty' => $availableQty - $removeQty
                                ]);
                                $amount = $stock->purchase_price * $removeQty;
                                $totalAmount = $amount + ($amount * ($stock->purchase_gst_percentage / 100));

                                $userSeller->update([
                                    'due_amount' => $userSeller->due_amount - $totalAmount
                                ]);
                                $removeQty = 0;
                            }
                        }
                    }

                    $stockHistory = StockHistory::create([
                        'user_id' => $data['user_id'],
                        'product_id' => $stock->product_id ? $stock->product_id : null,
                        'seller_id' => $stock->seller_id ? $stock->seller_id : null,
                        'stock_id'  => $id,
                        'price'     => $stock->purchase_price ? $stock->purchase_price : 0,
                        'gst'       => $stock->purchase_gst_percentage ? $stock->purchase_gst_percentage : 0,
                        'discount'  => 0,
                        'quantity'  => -abs($data['quantity']),
                        'created_by'  => $data['user_id']
                    ]);
                }
                DB::commit();
                Cache::tags(['stock_user_' . $user, 'products_user_' . $user, 'gst_collection_user_' . $user, 'billing_user_' . $user])->flush();
                return response()->json([
                    'status' => true,
                    'message' => 'Stock removed successfully',
                    'stock' => $stock
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have permission to access stock management!'
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
