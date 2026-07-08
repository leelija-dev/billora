<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Seller;
use App\Models\SellerPaymentHistory;
use App\Models\SellerProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SellerController extends Controller
{
    public function index(Request $request, $id)
    {
        $user = Auth::user()->id;
        $startTime = microtime(true);
        $search = $request->search;
        $due_amount = $request->due_amount ?? false;
        $start_date = $request->start_date ?? '';
        $end_date = $request->end_date ?? '';
        $page = $request->page ?? 1;
        if ($user != $id) {
            return response([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        try {
            $cacheKey = "seller_list_{$user}_" . md5(json_encode([
                'search' => $search,
                'due_amount' => $due_amount,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'page' => $page
            ]));
            $fromCache = Cache::tags(['seller_user_' . $user])->has($cacheKey);
            $seller = Cache::tags(['seller_user_' . $user])->remember($cacheKey, 600, function () use ($id, $search, $due_amount, $start_date, $end_date) {

                return Seller::where('user_id', $id)
                    ->when($search, function ($query) use ($search) {
                        $query->where(function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('city', 'LIKE', "%{$search}%")
                                ->orWhere('phone', 'LIKE', "%{$search}%")
                                ->orWhere('gst_number', 'LIKE', "%{$search}%")
                                ->orWhere('address', 'LIKE', "%{$search}%")
                                ->orWhere('state', 'LIKE', "%{$search}%")
                                ->orWhere('pincode', 'LIKE', "%{$search}%");
                        });
                    })
                    // Due Amount Filter
                    ->when($due_amount !== false, function ($query) {
                        $query->where('due_amount', '>', 0);
                    })

                    // Date Range Filter
                    ->when($start_date && $end_date, function ($query) use ($start_date, $end_date) {
                        $query->whereBetween('created_at', [
                            $start_date . ' 00:00:00',
                            $end_date . ' 23:59:59'
                        ]);
                    })

                    // Only Start Date
                    ->when($start_date && !$end_date, function ($query) use ($start_date) {
                        $query->whereDate('created_at', '>=', $start_date);
                    })

                    // Only End Date
                    ->when(!$start_date && $end_date, function ($query) use ($end_date) {
                        $query->whereDate('created_at', '<=', $end_date);
                    })
                    ->paginate(8);
            });
            $executionTime = microtime(true) - $startTime;
            return response([
                'status' => true,
                'message' => 'seller list',
                'response_time' => round($executionTime, 4) . ' sec',
                'response_from' => $fromCache ? 'Cache' : 'Database',
                'data' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request)
    {
        $user = Auth::user()->id;
        $data = $request->validate([
            'user_id' => 'required',
            'name' =>  'required',
            'email' => 'nullable|email',
            'phone' => 'nullable',
            'gst_number' => 'nullable',
            'address' => 'nullable',
            'city' => 'nullable',
            'state' => 'nullable',
            'pincode' => 'nullable',
            'due_amount' => 'nullable',

        ]);
        try {
            if ($data['user_id'] != $user) {
                return response([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ]);
            }
            $customer = Customers::findOrFail($user);
            if (!$customer) {
                return response([
                    'status' => false,
                    'message' => 'Customer not found'
                ]);
            }

            $seller = Seller::create($data);
            Cache::tags(['seller_user_' . $user])->flush();
            return response([
                'status' => true,
                'message' => 'Seller created successfully',
                'seller' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $id)
    {
        $user = Auth::user()->id;
        try {
            $data = $request->validate([
                'user_id' => 'required',
                'name' =>  'required',
                'email' => 'nullable|email',
                'phone' => 'nullable',
                'gst_number' => 'nullable',
                'address' => 'nullable',
                'city' => 'nullable',
                'state' => 'nullable',
                'pincode' => 'nullable',
            ]);
            if ($user != $data['user_id']) {
                return response([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ]);
            }
            $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
            if (!$seller) {
                return response([
                    'status' => false,
                    'message' => 'Seller not found'
                ]);
            }
            $seller->update($data);
            Cache::tags(['seller_user_' . $user])->flush();
            return response([
                'status' => true,
                'message' => 'Seller updated successfully',
                'seller' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function edit($id)
    {
        $user = Auth::user()->id;
        Cache::tags(['seller_user_' . $user])->flush();
        try {
            $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
            if (!$seller) {
                return response([
                    'status' => false,
                    'message' => 'Seller not found'
                ]);
            }
            return response([
                'status' => true,
                'message' => 'Seller details',
                'data' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id)
    {
        $user = Auth::user()->id;
        try {
            $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
            if (!$seller) {
                return response([
                    'status' => false,
                    'message' => 'Seller not found'
                ]);
            }
            $seller->delete();
            Cache::tags(['seller_user_' . $user])->flush();
            return response([
                'status' => true,
                'message' => 'Seller deleted successfully',
                'data' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function singleSeller($id)
    {
        $user = Auth::user()->id;
        Cache::tags(['seller_user_' . $user])->flush();
        try {
            $customer =  Customers::findOrFail($user);
            if (!$customer) {
                return response([
                    'status' => false,
                    'message' => 'unauthorized user'
                ]);
            }
            $seller = Seller::where('id', $id)->where('user_id', $user)->with('sellerProducts')->firstOrFail();
            if (!$seller) {
                return response([
                    'status' => false,
                    'message' => 'Seller not found!'
                ]);
            }
            return response([
                'status' => true,
                'message' => 'Single seller details',
                'data' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function duePay(Request $request, $id)
    {
        $data =  $request->validate([
            'user_id' =>   'required',
            'paid_amount' => 'required|numeric|min:0.01',
        ]);

        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::user()->id;
        if ($data['user_id'] != $user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        DB::beginTransaction();

        try {
            $seller = Seller::where('id', $id)->where('user_id', $user)->first();
            if (!$seller) {
                DB::rollBack();
                return response([
                    'status' => false,
                    'message' => 'Seller not found'
                ]);
            }
            $sellerProducts = SellerProducts::where('seller_id', $id)->where('user_id', $user)->orderBy('id', 'asc')->get();
            if ($data['paid_amount'] > $seller->due_amount) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paid amount cannot be greater than seller due amount.'
                ]);
            }

            if ($data['paid_amount'] < 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Paid amount cannot be negative.'
                ]);
            }
            if ($seller) {
                $seller->update([
                    'due_amount' => $seller->due_amount - $data['paid_amount']
                ]);
            }
            $paidAmount = $data['paid_amount'];
            foreach ($sellerProducts as $product) {

                if ($paidAmount <= 0) {
                    break;
                }

                $due = $product->total_amount - $product->paid_amount;
                if ($due <= 0) {
                    continue; // already fully paid
                }
                if ($paidAmount >= $due) {

                    $product->update([
                        'paid_amount' => $product->paid_amount + $due
                    ]);

                    $paidAmount -= $due;
                } else {

                    $product->update([
                        'paid_amount' => $product->paid_amount + $paidAmount
                    ]);

                    $paidAmount = 0;
                }
            }
            if ($data['paid_amount'] > 0) {
                SellerPaymentHistory::create([
                    'user_id'           => $user,
                    'seller_id'         => $id,
                    'invoice_id'        => null,
                    'paid_amount'       => $data['paid_amount'] ?? 0,
                    'payment_method'    => 'cash',
                    'remarks'           => 'Due Payment'
                ]);
            }
            DB::commit();
            Cache::tags(['seller_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Payment completed successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Cache::tags(['seller_user_' . $user])->flush();
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
