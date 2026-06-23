<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unit;
// use Psy\Util\Str;
use App\Models\Customers;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
class UnitController extends Controller
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
        $user = Auth::id();
        $sartTime = microtime(true);
        // $cacheKey = "unit_list_{$user}";
        $page = $request->page ?? 1;
        $search = $request->search;
        $cacheKey = "unit_list_{$user}_page_{$page}_search_" . md5($search);
        $fromCache = Cache::tags(['unit_user_' . $user])->has($cacheKey);
        $units = Cache::tags(['unit_user_'.$user])->remember($cacheKey,600, function () use ($user, $search) {
        return Unit::where('user_id', $user)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%$search%")
                      ->orWhere('name', 'like', "%$search%")
                      ->orWhere('code', 'like', "%$search%")
                      ->orWhere('slug', 'like', "%$search%");
                });
            })
            ->orderBy('id', 'desc')
            ->paginate(15);

        });
        $executionTime = microtime(true) - $sartTime;
        return response()->json([
            'status' => true,
            'message' => 'Unit List',
            'source' => $fromCache ? 'Cache' : 'Database',
            'response_time' => round($executionTime, 4) . ' sec',
            'data' => $units,
            'user_id' => $user
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
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::user()->id;
        $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        $unit = $request->validate([
            'code'        => 'required',
            'name'        => 'required',
        ]);
        try {
            $unit['user_id'] = $user;
            $unit['created_by'] =$user;
            $unit['slug'] = Str::slug($unit['name']);
            $data = Unit::create($unit);
            //  dd($unit);
            $units = Unit::where('user_id',$data->user_id)->get();
            Cache::tags(['unit_user_'.$user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Unit Created Successfully',
                'data' => $units
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
             if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
            }
            $user=Auth::user()->id;
            $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $unit = Unit::where('id', $id)->where('user_id',$user)->get();
            return response()->json([
                'status' => true,
                'message' => 'Unit Details',
                'data' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update($id, Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::user()->id;
        $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        $data = $request->validate([
            'code'    => 'required',
            'name'    => 'required'
        ]);
        try {
            $unit = Unit::where('id',$id)->where('user_id',$user)->first();
            // ->orWhere('user_id',auth()->user()->id),
            // ->orWhere('user_id',auth()->user()->created_by)->first();
            $unit->update($data);
            Cache::tags(['unit_user_'.$user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Unit Updated Successfully',
                'data' => $unit
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
            if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
            $user = Auth::user()->id;
            $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $unit = Unit::findOrFail($id);
            $unit->delete();
            Cache::tags(['unit_user_'.$user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Unit Deleted Successfully',
                'data' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
