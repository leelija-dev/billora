<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stocks;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Customers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
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
            
            $formCache = Cache::tags(['stock_user_' . Auth::user()->id])->has($cacheKey);
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
            Cache::tags(['stocks_user_' . Auth::user()->id])->flush();
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

        ]);
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
                $stocks = Stocks::where('user_id', $user)->get();
                Cache::tags(['stocks_user_' . $user])->flush();
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
            Cache::tags(['stocks_user_' . $id])->flush();
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
                
                $stock = Stocks::where('user_id', $user)->where('id', $id)->first();

                $stock->update($data);
                // $product->update([
                //     'selling_price' => $data['selling_price'],
                //     'purchase_price' => $data['purchase_price']
                // ]);
                Cache::tags(['stocks_user_' . $user])->flush();
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
                Cache::tags(['stocks_user_' . Auth::user()->id])->flush();
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
                Cache::tags(['stocks_user_' . Auth::user()->id])->flush();
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
