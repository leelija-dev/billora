<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;
use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Stocks;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\Store;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use App\Models\GstCollection;
use App\Models\PackageInvoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class InvoiceController extends Controller
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
            $start = microtime(true);
            $user = Auth::user()->id;
            $cacheKey = "billing_page_data_{$user}";
            $fromCache = Cache::tags(['billing_user_' . $user])->has($cacheKey);
            $data = Cache::tags(['billing_user_' . $user])->remember($cacheKey, 600, function () use ($user) {
                $customer =  Customers::findOrFail($user);
                // $search = $request->search ?? '';
                // if ($customer->plan_id == null || $customer->is_active == false) {
                //     return response()->json([
                //         'status' => false,
                //         'message' => 'You do not have any active plan. Please upgrade your plan.'
                //     ]);
                // }
                $permissions = DB::table('plan_permission_details as ppd')
                    ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                    ->where('ppd.plan_id', $customer->plan_id)
                    ->select('pp.permission_name', 'pp.id', 'pp.slug')
                    ->get();
                $hasStockPermission = false;

                // foreach ($permissions as $permission) {
                //     if ($permission->slug === 'stock-management') {
                //         $hasStockPermission = true;
                //         break;
                //     }
                // }
                // if ($hasStockPermission) {
                //     $products = Products::where('user_id', $user)
                //         ->with([
                //             'brand',
                //             'category',
                //             'unit',
                //             'stocks'
                //         ])
                //         ->where('is_active', true)
                //         ->where(function ($query) use ($search) {
                //             $query->where('name', 'like', "%$search%")
                //                 ->orWhere('sku', 'like', "%$search%");
                //         })
                //         ->whereHas('stocks')
                //         ->paginate(5);
                        

                //     // $products = Stocks::where('user_id', $user)
                //     //     ->with(['brand', 'category', 'unit', 'product'])
                //     //     ->get();
                // } else {
                //     $products = Products::where('user_id', $user)
                //         ->with(['brand', 'category', 'unit'])
                //         ->where('is_active', true)
                //         ->paginate(5);
                //         // ->get();
                // }
                $customers = BillCustomer::where('admin_id', $user)->get();
                $stores = Store::where('user_id', $user)->get();
                return [
                    'status' => true,
                    'message' => 'Products and Customers List',
                    // 'products' => $products,
                    'customers' => $customers,
                    'stores' => $stores,
                    'permissions' => $permissions
                ];
            });
            $executionTime = microtime(true) - $start;

            $data['response_time'] = round($executionTime, 4) . ' sec';
            $data['response_from'] = $fromCache ? 'Cache' : 'Database';
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function products(Request $request)
    {
        $user = Auth::id();
        $search = $request->search;

        $customer = Customers::findOrFail($user);

        if ($customer->plan_id == null || $customer->is_active == false) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have any active plan. Please upgrade your plan.'
            ]);
        }

        $permissions = DB::table('plan_permission_details as ppd')
            ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
            ->where('ppd.plan_id', $customer->plan_id)
            ->pluck('pp.slug');

        $hasStockPermission = $permissions->contains('stock-management');

        $query = Products::where('user_id', $user)
            ->with([
                'brand',
                'category',
                'unit'
            ])
            ->where('is_active', true)

            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {

                  $q->whereRaw(
                            "REPLACE(LOWER(name), \"'\", '') LIKE ?",
                            ['%' . str_replace("'", '', strtolower($search)) . '%']
                        )
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")

                        ->orWhereHas('brand', function ($brand) use ($search) {
                            $brand->where('name', 'like', "%{$search}%");
                        })

                        ->orWhereHas('category', function ($category) use ($search) {
                            $category->where('name', 'like', "%{$search}%");
                        })

                        ->orWhereHas('unit', function ($unit) use ($search) {
                            $unit->where('name', 'like', "%{$search}%");
                        });
                });
            });

        if ($hasStockPermission) {

            $query->with('stocks')
                ->whereHas('stocks');
        }

        $products = $query->paginate(5);

        return response()->json([
            'status' => true,
            'data' => $products
        ]);
    }


    public function store(Request $request)  // bill generate data store
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        $request->validate([
            "user_id"       => 'required',
            "customer_id"   => 'required|exists:bill_customer,id',
            "store_id"      => 'required|exists:store,id',
            "paid_amount"   => 'required|numeric|min:0',
            "created_by"    => 'required',
            "payment_method" => 'nullable|string',
            // "package_name"  => 'nullable',
            // "package_price" => 'nullable|numeric|min:0',
            // "package_size"  => 'nullable',
        ]);
        if ($user != $request->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to perform this action.',
                'user_id' => $user,
                'request_user_id' => $request->user_id
            ]);
        }
        DB::beginTransaction();
        $customer =  Customers::findOrFail($request->user_id);
        if ($customer->plan_id == null || $customer->is_active == false) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        try {
            // check permission 
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);


            $items = $request->items;
            $packages = $request->packages;
            $totalPackagePrice = 0;
            if (isset($packages)) {
                foreach ($packages as $package) {
                    $totalPackagePrice += (float)$package['package_price'] * (int)$package['quantity'];
                }
            }

            $totalAmount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {

                if ($hasStockPermission) {
                    $stock = Stocks::where('id', $item['stock_id'])
                        ->where('product_id', $item['product_id'])
                        ->first();

                    if (!$stock || $stock->quantity < $item['quantity']) {
                        DB::rollback();
                        return response()->json([
                            'status' => false,
                            'message' => 'Stock not available'
                        ]);
                    }
                    $price = $stock->selling_price;
                } else {
                    $product = Products::find($item['product_id']);
                    $price = $product->selling_price ?? 0;
                }
                // $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * ($item['gst'] ?? 0)) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }
            $preInv = Invoice::where('user_id', $request->user_id)->orderBy('id', 'desc')->first();
            $nextNumber = $preInv ? ((int)$preInv->invoice_number + 1) : 1;
            $invoiceNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
            // Store invoice
            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'user_id'       => $request->user_id,
                'customer_id'   => $request->customer_id,
                'store_id'      => $request->store_id,
                'total_amount'  => ($totalAmount + $totalPackagePrice),
                'total_items'   => $totalItems,
                'paid_amount'   => $request->paid_amount,
                'created_by'    => $request->created_by,
                'status'        => 'completed',
                "package_name"  => null,
                "package_price" => $totalPackagePrice ?? 0,
                "package_size"  => null,
            ]);

            // Store invoice items
            foreach ($items as $item) {
                if ($hasStockPermission) {
                    $stock = Stocks::where('id', $item['stock_id'])
                        ->where('product_id', $item['product_id'])
                        ->first();

                    $price = $stock->selling_price;
                } else {
                    $product = Products::find($item['product_id']);
                    $price = $product->selling_price ?? 0;
                }
                // $price = $item['price'];
                $qty = $item['quantity'];

                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);
                $product = Products::find($item['product_id']);
                InvoiceItems::create([
                    'user_id'       => $request->user_id,
                    'invoice_id'    => $invoice->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $qty,
                    'item_count'    => $qty,
                    'unit_id'       => $item['unit_id'],
                    'price'         => $price,
                    'gst'           => $item['gst'] ?? 0,
                    'discount'      => $item['discount'] ?? 0,
                    'total_price'   => $totalPrice,
                    'status'        => 'completed',
                    'created_by'    => $request->created_by
                ]);
                GstCollection::create([
                    'user_id' => $request->user_id,
                    'invoice_id' => $invoice->id,
                    'customer_id' => $request->customer_id,
                    'product_id' => $item['product_id'],
                    'purchase_price' => $product->purchase_price ?? 0,
                    'purchase_gst_percentage' => $product->purchase_gst_percentage ?? 0,
                    'purchase_gst_amount' => $product->purchase_price * $product->purchase_gst_percentage / 100 ?? 0,
                    'selling_price' => $product->selling_price ?? 0,
                    'selling_discount_percentage' => $product->discount_percentage ?? 0,
                    'selling_gst_percentage' => $product->gst_percentage ?? 0,
                    'selling_gst_amount' => $product->selling_price * $product->gst_percentage / 100 ?? 0,
                    'quantity' => $qty,
                    'govt_pay_status' => false,
                    'invoice_status' => 'completed',
                    'created_by'     => $request->created_by
                ]);
            }
            if (isset($packages)) {
                foreach ($packages as $package) {
                    PackageInvoice::create([
                        'user_id'       => $request->user_id,
                        'invoice_id'    => $invoice->id,
                        'package_id'    => $package['package_id'] ?? null,
                        'package_name'  => $package['package_name'] ?? null,
                        'package_price' => $package['package_price'] ?? 0,
                        'package_size'  => $package['package_size'] ?? null,
                        'quantity'      => $package['quantity'] ?? 0,
                        'created_by'    => $request->created_by ?? null
                    ]);
                }
            }
            // payment history
            BillPaymentHistory::create([
                'admin_id'       => $request->user_id,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $request->customer_id,
                'store_id'       => $request->store_id,
                'total_amount'   => $totalAmount,
                'paid_amount'    => $request->paid_amount,
                'due_amount'     => $totalAmount - $request->paid_amount,
                'payment_method' => $request->payment_method ?? 'Cash',
                'remarks'        => 'Bill Generated',
                'transaction_id' => null,
                'created_by'     => $request->created_by
            ]);
            // update due amount in customer 
            $customer = BillCustomer::find($request->customer_id);
            $due_amount = ($customer->due_amount + ($totalAmount - $request->paid_amount));
            $customer->update([
                'due_amount' => $due_amount
            ]);

            //stock update
            if ($hasStockPermission) {
                foreach ($items as $item) {
                    $stock = Stocks::where('id', $item['stock_id'])->where('product_id', $item['product_id'])->first();
                    if ($stock->quantity >= $item['quantity'])
                        $stock->update([
                            'quantity' => $stock->quantity - $item['quantity']
                        ]);
                    else {
                        return response()->json([
                            'status'    => false,
                            'message'   => 'Stock not available'
                        ]);
                    }
                }
            }
            DB::commit();
            Cache::tags([
                'invoice_user_' . $user,
                'billing_user_' . $user,
                'customer_wise_user_' . $user,
                'single_invoice_' . $user,
                'with_out_stock_user_' . $user,
                'gst_collection_user_' . $user

            ])->flush();
            return response()->json([
                'status'  => true,
                'message' => 'Invoice Created Successfully',
                'invoice_id' => $invoice->id,
                'stock_permission' => $hasStockPermission
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function show($id)
    {
        try {
            $start = microtime(true);
            $userId = Auth::user()->id;
            $cacheKey = "invoice_single_data_{$userId}_{$id}";
            $fromCache = Cache::tags([
                'single_invoice_' . $userId
            ])->has($cacheKey);
            $data = Cache::tags([
                'single_invoice_' . $userId
            ])->remember($cacheKey, 600, function () use ($userId, $id) {
                $customer =  Customers::findOrFail($userId);
                if ($customer->plan_id == null || $customer->is_active == false) {
                    return response()->json([
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ]);
                }
                $bill = Invoice::with('invoiceItems', 'packages')
                    ->where('user_id', $userId)
                    ->where('id', $id)
                    ->first();

                if (!$bill) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Bill not found'
                    ], 404);
                }
                $billPaymentHistory = BillPaymentHistory::where('admin_id', $userId)->where('invoice_id', $id)->orderBy('id', 'asc')->first();
                // $bill_summery = InvoiceItems::where('invoice_id', $id)->where('user_id', $userId)->get();
                $billSummary = InvoiceItems::where('invoice_id', $id)
                    ->where('user_id', $userId)
                    ->selectRaw('
                        SUM(price * quantity) as subtotal,
                        SUM(((price * quantity) * discount) / 100) as total_discount,
                        SUM((((price * quantity) - (((price * quantity) * discount) / 100)) * gst) / 100) as total_gst,
                        SUM(total_price) as grand_total
                    ')
                    ->first();

                $packages = PackageInvoice::where('invoice_id', $id)
                    ->where('user_id', $userId)
                    ->selectRaw('COALESCE(
                        SUM(package_price * quantity),0) as total_package_price
                    ')
                    ->first();

                $billSummary['packagess'] = $packages;
                $bill['payment_method'] = $billPaymentHistory['payment_method'] ?? null;
                return [
                    'status' => true,
                    'message' => 'Single Bill',
                    'bill_summary' => $billSummary,
                    'data' => $bill,
                    'bill_payment_history' => $billPaymentHistory
                ];
            });
            $executionTime = microtime(true) - $start;

            $data['response_from'] =
                $fromCache ? 'Cache' : 'Database';

            $data['response_time'] =
                round($executionTime, 4) . ' sec';

            return response()->json($data);
        } catch (\Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function billHistory(Request $request)
    {
        try {
            $start = microtime(true);
            $user = Auth::user()->id;
            $search = $request->search ?? '';
            $page = $request->page ?? 1;

            // Dynamic cache key
            $cacheKey = "bill_history_{$user}_search_" . md5($search) . "_page_{$page}";
            // Check cache exists
            $fromCache = Cache::tags(['invoice_user_' . $user])->has($cacheKey);
            // $billHistory = Invoice::with(['invoiceItems.product', 'packages'])
            // $billHistory = Cache::remember($cacheKey, 600, function () use ($user, $search) {
            $billHistory = Cache::tags(['invoice_user_' . $user])->remember($cacheKey, 600, function () use ($user, $search) {


                return Invoice::with([
                    'invoiceItems.product',
                    'packages',
                    'customer'
                ])
                    ->where('user_id', $user)

                    ->when($search, function ($query) use ($search) {

                        $query->where(function ($q) use ($search) {

                            $q->where('id', 'like', "%$search%")
                                ->orWhere('total_amount', 'like', "%$search%")

                                ->orWhereHas('invoiceItems', function ($subQ) use ($search) {
                                    $subQ->where('price', 'like', "%$search%")
                                        ->orWhere('quantity', 'like', "%$search%");
                                })

                                ->orWhereHas('invoiceItems.product', function ($subQ) use ($search) {
                                    $subQ->where('name', 'like', "%$search%")
                                        ->orWhere('sku', 'like', "%$search%");
                                })

                                ->orWhereHas('customer', function ($subQ) use ($search) {
                                    $subQ->where('name', 'like', "%$search%")
                                        ->orWhere('phone', 'like', "%$search%")
                                        ->orWhere('email', 'like', "%$search%");
                                });
                        });
                    })

                    ->orderBy('created_at', 'desc')
                    ->paginate(15);
            });
            // Response time
            $executionTime = microtime(true) - $start;

            return response()->json([
                'status'    => true,
                'message'   => 'Bill History',
                'response_time'  => round($executionTime, 4) . ' sec',
                'response_from'  => $fromCache ? 'Cache' : 'Database',
                'data'      => $billHistory
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }

    /* with out stock management bill generate */
    // public function bill($id)
    // {
    //     if (!Auth::check()) {
    //         return response()->json([
    //             'status'    => false,
    //             'message'   => 'Authentication required. Please login first.'
    //         ]);
    //     }
    //     $start = microtime(true);
    //     $user = Auth::user()->id;
    //     $cacheKey = "with_out_stock_page_data_{$user}";    
    //     $customer =  Customers::findOrFail($user);
    //     if ($customer->plan_id == null || $customer->is_active == false) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'You do not have any active plan. Please upgrade your plan.'
    //         ]);
    //     }
    //     $products = Products::with(['brand', 'category', 'unit'])
    //         ->where('is_active', true)
    //         ->where('user_id', $id)
    //         ->get();
    //     $customers = BillCustomer::where('admin_id', $id)->get();
    //     $stores = Store::where('user_id', $id)->get();
    //     return response()->json([
    //         'status'    => true,
    //         'message'   => 'Products and Customers List from product table',
    //         'products'  => $products,
    //         'customers' => $customers,
    //         'stores'    => $stores
    //     ]);
    // }
    public function bill($id)
    {
        try {

            if (!Auth::check()) {

                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }

            $start = microtime(true);

            $user = Auth::user()->id;

            // Cache key
            $cacheKey = "with_out_stock_page_data_{$user}_{$id}";

            // Check cache
            $fromCache = Cache::tags([
                'with_out_stock_user_' . $user
            ])->has($cacheKey);

            // Cache data
            $data = Cache::tags([
                'with_out_stock_user_' . $user
            ])->remember($cacheKey, 600, function () use ($user, $id) {

                $customer = Customers::findOrFail($user);

                if (
                    $customer->plan_id == null ||
                    $customer->is_active == false
                ) {

                    return [
                        'status' => false,
                        'message' => 'You do not have any active plan. Please upgrade your plan.'
                    ];
                }

                $products = Products::with([
                    'brand',
                    'category',
                    'unit'
                ])
                    ->where('is_active', true)
                    ->where('user_id', $id)
                    ->get();

                $customers = BillCustomer::where('admin_id', $id)->get();

                $stores = Store::where('user_id', $id)->get();

                return [
                    'status' => true,
                    'message' => 'Products and Customers List from product table',
                    'products' => $products,
                    'customers' => $customers,
                    'stores' => $stores
                ];
            });

            $executionTime = microtime(true) - $start;

            $data['response_from'] =
                $fromCache ? 'Cache' : 'Database';

            $data['response_time'] =
                round($executionTime, 4) . ' sec';

            return response()->json($data);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function billStore(Request $request)  // bill generate data form product table with out stock management
    {
        $request->validate([
            "user_id"       => 'required|exists:customers,id',
            "customer_id"   => 'required|exists:bill_customer,id',
            "store_id"      => 'required|exists:store,id',
            "paid_amount"   => 'required|numeric|min:0',
            "created_by"    => 'required',
        ]);

        DB::beginTransaction();
        $customer =  Customers::findOrFail($request->user_id);
        if ($customer->plan_id == null || $customer->is_active == false) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        try {

            $items = $request->items;

            $totalAmount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * ($item['gst'] ?? 0)) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }

            // Store invoice
            $invoice = Invoice::create([
                'user_id'       => $request->user_id,
                'customer_id'   => $request->customer_id,
                'store_id'      => $request->store_id,
                'total_amount'  => $totalAmount,
                'total_items'   => $totalItems,
                'paid_amount'   => $request->paid_amount,
                'created_by'    => $request->created_by,
            ]);

            // Store invoice items
            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];

                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * ($item['gst'] ?? 0)) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);

                InvoiceItems::create([
                    'user_id'       => $request->user_id,
                    'invoice_id'    => $invoice->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $qty,
                    'item_count'    => $qty,
                    'unit_id'       => $item['unit_id'],
                    'price'         => $price,
                    'gst'           => $item['gst'] ?? 0,
                    'discount'      => $item['discount'] ?? 0,
                    'total_price'   => $totalPrice,
                    'status'        => 'completed',
                    'created_by'    => $request->created_by
                ]);
            }
            // payment history
            BillPaymentHistory::create([
                'admin_id'       => $request->user_id,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $request->customer_id,
                'store_id'       => $request->store_id,
                'total_amount'   => $totalAmount,
                'paid_amount'    => $request->paid_amount,
                'due_amount'     => $totalAmount - $request->paid_amount,
                'payment_method' => $request->payment_method ?? 'Cash',
                'transaction_id' => null,
                'remarks'        => '',
                'created_by'     => $request->created_by
            ]);
            // update due amount in customer 
            $customer = BillCustomer::find($request->customer_id);
            $due_amount = ($customer->due_amount + ($totalAmount - $request->paid_amount));
            $customer->update([
                'due_amount' => $due_amount
            ]);

            DB::commit();
            Cache::tags([
                'invoice_user_' . $request->user_id,
                'billing_user_' . $request->user_id,
                'customer_wise_user_' . $request->user_id,
                'single_invoice_' . $request->user_id,
                'with_out_stock_user_' . $request->user_id,
                'gst_collection_user_' . $request->user_id
            ])->flush();
            return response()->json([
                'status'        => true,
                'message'       => 'Invoice Created Successfully',
                'invoice_id'    => $invoice->id
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $id)
    {

        $data = $request->validate([
            'user_id'       => 'required|exists:customers,id',
            'customer_id'   => 'required|exists:bill_customer,id',
            'store_id'      => 'required|exists:store,id',
            'paid_amount'   => 'required|numeric|min:0',
            'created_by'    => 'required',
            'items'         => 'required|array|min:1',
            'deleted_item_ids' => 'nullable|array',

        ]);
        // $data = $request->all();
        $user = Auth::user()->id;
        if ($user != $data['user_id']) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to update this invoice'
            ]);
        }
        DB::beginTransaction();
        try {
            $invoice = Invoice::where('id', $id)->where('user_id', $data['user_id'])->firstOrFail();
            $oldItems = InvoiceItems::where('invoice_id', $invoice->id)->where('user_id', $data['user_id'])->get();
            $customer =  Customers::findOrFail($request->user_id);
            $billCustomer = BillCustomer::where('id', $data['customer_id'])->where('admin_id', $data['user_id'])->firstOrFail();
            $permissions = DB::table('plan_permission_details as ppd')  //stock permission 
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);
            $newItems = collect($request->items);
            $requestProductIds = $newItems->pluck('product_id')->toArray();
            //deleted items resrtore stock if stock permission
            if (isset($data['deleted_item_ids']) && count($data['deleted_item_ids']) > 0) {
                foreach ($data['deleted_item_ids'] as $id) {

                    $invoiceItem = InvoiceItems::where('invoice_id', $invoice->id)->where('id', $id)->first();
                    if ($hasStockPermission) {
                        $stocks = Stocks::where('user_id', $data['user_id'])->where('product_id', $invoiceItem->product_id)->first();
                        if ($stocks) {
                            $stocks->update([
                                'quantity' => $stocks->quantity + $invoiceItem->quantity
                            ]);
                        }
                    }
                    $gstCollection =  GstCollection::where('user_id', $data['user_id'])->where('invoice_id', $invoice->id)->where('product_id', $invoiceItem->product_id)->first();
                    if ($gstCollection) {
                        $gstCollection->delete();
                    }
                    $invoiceItem->delete();
                }
            }

            //update invoice 
            $totalAmount = 0;
            $totalItems = count($newItems);

            foreach ($newItems as $item) {

                if ($hasStockPermission) {
                    $stock = Stocks::where('id', $item['stock_id'])
                        ->where('product_id', $item['product_id'])
                        ->first();

                    if (!$stock) {
                        DB::rollback();
                        return response()->json([
                            'status' => false,
                            'message' => 'Stock not available'
                        ]);
                    }
                    $price = $stock->selling_price;
                } else {
                    $product = Products::find($item['product_id']);
                    $price = $product->selling_price ?? 0;
                }
                // $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * ($item['gst'] ?? 0)) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }
            $dueAmount = max(0, $totalAmount - $request->paid_amount);
            $due_amount = (($billCustomer->due_amount - ($invoice->total_amount - $invoice->paid_amount)) + ($totalAmount - $request->paid_amount));
            Log::info('paid_amount: ' . $request->paid_amount);
            Log::info('totalAmount: ' . $totalAmount);
            Log::info('due_amount: ' . $due_amount);
            $invoice->update([
                'customer_id'   => $request->customer_id,
                'store_id'      => $request->store_id,
                'total_amount'  => $totalAmount,
                'total_items'   => $totalItems,
                'paid_amount'   => $request->paid_amount,

            ]);

            //Invpoice Items update and add 
            foreach ($newItems as $item) {
                // $exist = InvoiceItems::where('invoice_id', $invoice->id)->where('product_id', $item['product_id'])->first();
                $exist = null;

                if (isset($item['id'])) {

                    $exist = InvoiceItems::where('invoice_id', $invoice->id)
                        ->where('id', $item['id'])
                        ->first();
                }
                if ($hasStockPermission) {
                    $stock = Stocks::where('id', $item['stock_id'])
                        ->where('product_id', $item['product_id'])
                        ->first();

                    $price = $stock->selling_price;
                } else {
                    $product = Products::find($item['product_id']);
                    $price = $product->selling_price ?? 0;
                }
                $qty = $item['quantity'];
                $product = Products::find($item['product_id']);
                $discount = ((($price * $qty) * ($item['discount'] ?? 0)) / 100);
                $gst = (((($price * $qty) - $discount) * ($item['gst'] ?? 0)) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);
                if ($exist) {
                    if ($hasStockPermission) {

                        $oldQty = $exist->quantity;

                        $differenceQty = $qty - $oldQty;

                        if ($differenceQty > 0) {

                            if ($stock->quantity < $differenceQty) {

                                DB::rollback();

                                return response()->json([
                                    'status' => false,
                                    'message' => 'Stock not available'
                                ]);
                            }

                            $stock->decrement('quantity', $differenceQty);
                        } elseif ($differenceQty < 0) {

                            $stock->increment('quantity', abs($differenceQty));
                        }
                    }
                    $exist->update([
                        'quantity' => $item['quantity'],
                        'unit_id'       => $item['unit_id'],
                        'item_count' => $item['quantity'],
                        'price' => $item['price'],
                        'gst' => $item['gst'] ?? 0,
                        'discount' => $item['discount'] ?? 0,
                        'total_price' => $totalPrice ?? 0,
                    ]);
                    $gstCollections =  GstCollection::where('user_id', $data['user_id'])->where('invoice_id', $invoice->id)->where('product_id', $item['product_id'])->first();
                    $product = Products::find($item['product_id']);
                    if ($gstCollections) {
                        $gstCollections->update([
                            'purchase_price' => $product->purchase_price,
                            'purchase_gst_percentage' => $product->purchase_gst_percentage ?? 0,
                            'purchase_gst_amount' => $product->purchase_price * $product->purchase_gst_percentage / 100 ?? 0, //$item['discount'] ?? 0,
                            'selling_price'  => $item['price'] ?? 0,
                            'selling_discount_percentage' => $item['discount'] ?? 0,
                            'selling_gst_percentage' => $item['gst'] ?? 0,
                            'selling_gst_amount' => $item['price'] * $item['gst'] / 100,
                            'quantity' => $item['quantity'],
                            'govt_pay_status' => false,
                            'invoice_status' => 'completed',
                        ]);
                    } else {
                        GstCollection::create([
                            'user_id' => $data['user_id'],
                            'invoice_id' => $invoice->id,
                            'product_id' => $item['product_id'],
                            'customer_id' => $request->customer_id,
                            'purchase_price' => $product->purchase_price,
                            'purchase_gst_percentage' => $product->purchase_gst_percentage ?? 0,
                            'purchase_gst_amount' => $product->purchase_price * $product->purchase_gst_percentage / 100 ?? 0, //$item['discount'] ?? 0,
                            'selling_price'  => $item['price'] ?? 0,
                            'selling_discount_percentage' => $item['discount'] ?? 0,
                            'selling_gst_percentage' => $item['gst'] ?? 0,
                            'selling_gst_amount' => $item['price'] * $item['gst'] / 100,
                            'quantity' => $item['quantity'],
                            'govt_pay_status' => false,
                            'invoice_status' => 'completed',
                            'created_by' => $request->created_by
                        ]);
                    }
                } else {
                    InvoiceItems::create([
                        'user_id'       => $data['user_id'],
                        'invoice_id'    => $invoice->id,
                        'product_id'    => $item['product_id'],
                        'quantity'      => $item['quantity'],
                        'item_count'    => $item['quantity'],
                        'unit_id'       => $item['unit_id'],
                        'price'         => $item['price'] ?? 0,
                        'gst'           => $item['gst'] ?? 0,
                        'discount'      => $item['discount'] ?? 0,
                        'total_price'   => $totalPrice ?? 0,
                        'status'        => 'completed',
                        'created_by'    => $request->created_by
                    ]);
                    if ($hasStockPermission) {
                        $stocks = Stocks::where('user_id', $data['user_id'])->where('product_id', $item['product_id'])->first();
                        if ($stocks) {
                            $stocks->update([
                                'quantity' => $stocks->quantity - $item['quantity']
                            ]);
                        }
                    }
                    GstCollection::create([
                        'user_id' => $request->user_id,
                        'invoice_id' => $invoice->id,
                        'customer_id' => $request->customer_id,
                        'product_id' => $item['product_id'],
                        'purchase_price' => $product->purchase_price ?? 0,
                        'purchase_gst_percentage' => $product->purchase_gst_percentage ?? 0,
                        'purchase_gst_amount' => $product->purchase_price * $product->purchase_gst_percentage / 100 ?? 0,
                        'selling_price' => $product->selling_price ?? 0,
                        'selling_discount_percentage' => $product->discount_percentage ?? 0,
                        'selling_gst_percentage' => $product->gst_percentage ?? 0,
                        'selling_gst_amount' => $product->selling_price * $product->gst_percentage / 100 ?? 0,
                        'quantity' => $qty,
                        'govt_pay_status' => false,
                        'invoice_status' => 'completed',
                        'created_by'     => $request->created_by
                    ]);
                }
            }
            $billPaymentHistory = BillPaymentHistory::where('admin_id', $request->user_id)->where('invoice_id', $invoice->id)->orderBy('id', 'asc')->first();
            if ($billPaymentHistory) {
                $billPaymentHistory->update([
                    'customer_id'    => $request->customer_id,
                    'store_id'       => $request->store_id,
                    'total_amount'   => $totalAmount,
                    'paid_amount'    => $request->paid_amount,
                    'due_amount'     => $totalAmount - $request->paid_amount,
                    'payment_method' => $request->payment_method ?? 'Cash',
                    'remarks'        => 'Bill Generated',
                ]);
            }
            if ($billCustomer) {
                // $due_amount = (($billCustomer->due_amount - 
                $billCustomer->update([
                    'due_amount' => $due_amount
                ]);
            }
            DB::commit();
            Cache::tags([
                'invoice_user_' . $request->user_id,
                'billing_user_' . $request->user_id,
                'customer_wise_user_' . $request->user_id,
                'single_invoice_' . $request->user_id,
                'with_out_stock_user_' . $request->user_id
            ])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Invoice updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function  updateBillStatus($id)
    {
        $user = Auth::user()->id;
        DB::beginTransaction();
        try {
            $invoice = Invoice::where('id', $id)->where('user_id', $user)->firstOrFail();

            if ($invoice->status == 'cancelled') {
                return response()->json([
                    'status' => false,
                    'message' => 'Invoice already cancelled'
                ]);
            }
            $billCustomer = BillCustomer::where('id', $invoice->customer_id)->where('admin_id', $user)->firstOrFail();
            $invoiceItem = InvoiceItems::where('invoice_id', $invoice->id)->where('user_id', $user)->get();
            // $gstCollection = GstCollection::where('invoice_id', $invoice->id)->where('user_id', $user)->get();
            $customer = Customers::findOrFail($user);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);
            //stock reverse/update
            if ($hasStockPermission) {
                foreach ($invoiceItem as $item) {
                    Stocks::where('user_id', $user)
                        ->where('product_id', $item->product_id)
                        ->increment('quantity', $item->quantity);
                }
            }
            //invoice item status update
            InvoiceItems::where('invoice_id', $invoice->id)
                ->where('user_id', $user)->update([
                    'status' => 'cancelled'
                ]);
            //gst collection status update
            GstCollection::where('invoice_id', $invoice->id)
                ->where('user_id', $user)
                ->update([
                    'govt_pay_status' => false,
                    'invoice_status' => 'cancelled',
                ]);
            //invoice status update
            $invoice->update([
                'status' => 'cancelled',
                'updated_at' => now()
            ]);
            //customer due update
            if ($billCustomer)
                $billCustomer->update([
                    'due_amount' => ($billCustomer->due_amount - ($invoice->total_amount - $invoice->paid_amount)),
                ]);
            DB::commit();
            Cache::tags([
                'invoice_user_' . $user,
                'billing_user_' . $user,
                'customer_wise_user_' . $user,
                'single_invoice_' . $user,
                'with_out_stock_user_' . $user
            ])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Invoice cancelled successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function customerInvoices($id)
    {
        $user = Auth::user()->id;
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Authentication required. Please login first.'
                ]);
            }
            $start = microtime(true);
            $customer = BillCustomer::where('id', $id)->where('admin_id', $user)->first();
            if (!$customer) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Customer not found'
                ]);
            }
            $cacheKey = "customer_invoices_{$user}_{$id}";

            $fromCache = Cache::tags([
                'customer_wise_user_' . $user
            ])->has($cacheKey);

            $invoices = Cache::tags([
                'customer_wise_user_' . $user
            ])->remember($cacheKey, 600, function () use ($id, $user) {

                return Invoice::with([
                    'invoiceItems.product',
                    'customer'
                ])
                    ->where('customer_id', $id)
                    ->where('user_id', $user)
                    ->orderBy('created_at', 'desc')
                    ->get();
            });
            $executionTime = microtime(true) - $start;
            return response()->json([
                'status' => true,
                'message' => 'Customer Invoices',
                'response_from' => $fromCache ? 'Cache' : 'Database',
                'response_time' => round($executionTime, 4) . ' sec',
                'data' => $invoices
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }

    public function invoiceDuePay(Request $request, $id)
    {

        if (!Auth::check()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        $data = $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',

        ]);


        DB::beginTransaction();

        try {
            $invoice = Invoice::where('id', $id)->where('user_id', $user)->first();

            if (!$invoice) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Invoice not found'
                ]);
            }

            if ($invoice->status == 'cancelled') {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Cannot pay due for cancelled invoice'
                ]);
            }
            if (($invoice->total_amount - $invoice->paid_amount) <= 0) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'No due amount for this invoice'
                ]);
            }
            if (($invoice->total_amount - $invoice->paid_amount) < $data['paid_amount']) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Paid amount exceeds due amount',
                    'due amount' => $invoice->total_amount - $invoice->paid_amount
                ]);
            }
            if ($data['paid_amount'] <= 0) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Paid amount must be greater than zero'
                ]);
            }
            $newPaidAmount = (float)$invoice->paid_amount + (float)$data['paid_amount'];
            $newDueAmount  = (float)$invoice->total_amount - $newPaidAmount;

            $customer = BillCustomer::where('id', $invoice->customer_id)->where('admin_id', $user)->first();
            if (!$customer) {
                return response()->json([
                    'status'    => false,
                    'message'   => 'Customer not found'
                ]);
            }
            //invoice paid amount update
            $invoice->update([
                'paid_amount' => (float)$invoice->paid_amount + (float)$data['paid_amount'],
            ]);
            //customer due update
            $customer->update([
                'due_amount' => (float)$customer->due_amount - (float)$data['paid_amount'],
            ]);
            // update 
            BillPaymentHistory::create([
                'admin_id'       => $user,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $invoice->customer_id,
                'store_id'       => $invoice->store_id,
                'total_amount'   => $invoice->total_amount,
                'paid_amount'    => $data['paid_amount'],
                'due_amount'     => ($invoice->total_amount - ($invoice->paid_amount + $data['paid_amount'])),
                'payment_method' => $data['payment_method'],
                'transaction_id' => null,
                'remarks'        => 'invoice due payment',
                'created_by'     => $user
            ]);
            DB::commit();
            Cache::tags([
                'invoice_user_' . $user,
                'billing_user_' . $user,
                'customer_wise_user_' . $user,
                'single_invoice_' . $user,
                'with_out_stock_user_' . $user
            ])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Due payment successful',
                'data' => [
                    'invoice_id' => $invoice->id,
                    'total_amount' => $invoice->total_amount,
                    'paid_amount' => $newPaidAmount,
                    'due_amount' => $newDueAmount
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
}
