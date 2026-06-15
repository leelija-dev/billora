<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use App\Models\Customers;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class StoreController extends Controller
{
    public function index(Request $request, $id)
    {
        try {
            $user = Auth::user()->id;
            if ($user != $id) {
                return response()->json([
                    'status' => false,
                    'user' => $user,
                    'id' => $id,
                    'message' => 'Unauthorized, You are not allowed to perform this action',

                ]);
            }
            $startTime = microtime(true);
            // $cacheKey = "store_list_{$user}_page_" . $request->page ?? 1;

            $search = $request->search;
            $startDate = $request->start_date;
            $endDate = $request->end_date;
            $status = $request->status;

            $cacheKey = 'store_list_' . $user . '_' . md5(json_encode([
                'page' => $request->page ?? 1,
                'search' => $search,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
            ]));
            $formCache = Cache::tags(['store_user_' . $user])->has($cacheKey);
            $store = Cache::tags(['store_user_' . $user])->remember(
                $cacheKey,
                600,
                function () use ($user, $search, $startDate, $endDate, $status) {

                    return Store::where('user_id', $user)
                        ->when($search, function ($q) use ($search) {
                            $q->where(function ($sub) use ($search) {
                                $sub->where('name', 'like', "%{$search}%")
                                    ->orWhere('gst', 'like', "%{$search}%")
                                    ->orWhere('email', 'like', "%{$search}%")
                                    ->orWhere('mobile', 'like', "%{$search}%")
                                    ->orWhere('address', 'like', "%{$search}%")
                                    ->orWhere('city', 'like', "%{$search}%");
                            });
                        })
                        ->when($startDate && $endDate, function ($q) use ($startDate, $endDate) {
                            $q->whereBetween('created_at', [$startDate, $endDate]);
                        })
                        ->when($status !== null && $status !== '', function ($q) use ($status) {
                            $q->where('status', $status);
                        })
                        ->orderByDesc('id')
                        ->paginate(15);
                }
            );
            // if ($store->isEmpty()) {
            //     return response()->json([
            //         'status' => false,
            //         'message' => 'Does not have any data',
            //         'data' => null
            //     ]);
            // }
            $executionTime = microtime(true) - $startTime;
            return response()->json([
                'status' => true,
                'message' => 'Store List',
                'source' => $formCache ? 'Cache' : 'Database',
                'response_time' => round($executionTime, 4) . ' sec',
                'data' => $store
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ]);
        }
    }
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;

        $store = $request->validate([
            'user_id'     => 'required',
            'name'        => 'required',
            'gst'         => 'nullable',
            'email'       => 'nullable',
            'logo'        => 'nullable',
            'mobile'      => 'nullable',
            'address'     => 'nullable',
            'city'        => 'nullable',
            'state'       => 'nullable',
            'pincode'     => 'nullable',
            'status'      => 'required',
            'created_by'  => 'required'
        ]);
        // dd($store);
        $folderPath = public_path('logos');

        // Create folder if not exists
        if (!File::exists($folderPath)) {
            File::makeDirectory($folderPath, 0777, true, true);
        }
        $imagePath = null;
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $fileName = time() . '_' . $image->getClientOriginalName();
            $image->move($folderPath, $fileName);

            $imagePath = 'logos/' . $fileName;
        }
        $store['logo'] = $imagePath;
        if ($store['user_id'] != $user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized, You are not allowed to perform this action',
            ]);
        }
        $customer =  Customers::findOrFail($store['user_id']);
        if ($customer->plan_id == null || $customer->is_active == false) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        try {
            $store = Store::create($store);
            Cache::tags(['store_user_' . $user, 'billing_user_' . $user, 'single_invoice_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Store Created Successfully',
                'data' => $store
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

            $userId = Auth::user()->id;
            $customer =  Customers::findOrFail($userId);
            Cache::tags(['store_user_' . $userId, 'billing_user_' . $userId, 'single_invoice_' . $userId])->flush();
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $store = Store::where('user_id', $userId)
                ->where('id', $id)
                ->first();

            if (!$store) {
                return response()->json([
                    'status' => false,
                    'message' => 'Store not found'
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Store Details',
                'data' => $store
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
        $user = Auth::user()->id;
        $data = $request->validate([
            'name'    => 'required',
            'gst'     => 'nullable',
            'email'   => 'nullable',
            'logo'    => 'nullable',
            'mobile'  => 'nullable',
            'address' => 'nullable',
            'city'    => 'nullable',
            'state'       => 'nullable',
            'pincode'     => 'nullable',
            'status'  => 'required',
        ]);

        try {
            $customer =  Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }

            $store = Store::where('user_id', $user)->where('id', $id)->first();

            $folderPath = public_path('logos');

            // Create folder if not exists
            if (!File::exists($folderPath)) {
                File::makeDirectory($folderPath, 0777, true, true);
            }
            // $imagePath = null;
            if ($request->hasFile('logo')) {

                // delete old image
                if ($store->logo && File::exists(public_path($store->logo))) {
                    File::delete(public_path($store->logo));
                }

                // upload new image
                $image = $request->file('logo');
                $fileName = time() . '_' . $image->getClientOriginalName();
                $image->move($folderPath, $fileName);

                // update only if new image exists
                $data['logo'] = 'logos/' . $fileName;
            }
            $store->update($data);
            Cache::tags(['store_user_' . $user, 'billing_user_' . $user, 'single_invoice_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Store Updated Successfully',
                'data' => $store
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
            $user = Auth::user()->id;
            $customer =  Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $store = Store::where('user_id', $user)->where('id', $id)->firstOrFail();
            $store->delete();
            Cache::tags(['store_user_' . $user, 'billing_user_' . $user, 'single_invoice_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Store Deleted Successfully',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'user' => $user,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
