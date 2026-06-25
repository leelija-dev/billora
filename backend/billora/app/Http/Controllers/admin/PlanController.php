<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\PlanBusinessType;
use App\Models\PlanPermission;
use Illuminate\Http\Request;
use App\Models\Plans;
use App\Models\PlanPermissionDetails;
use App\Models\PlanPurchaseHistory;
use App\Models\Stocks;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PlanController extends Controller
{
    public function index()
    {
        $startTime = microtime(true);
        $cacheKey = 'plans_user';
        $fromCache = Cache::tags(['users_plans'])->has($cacheKey);

        $data =Cache::tags(['users_plans'])->remember($cacheKey, 600, function () {
            return Plans::with('permissions', 'business_types.businessType')
                ->where('is_active', true)
                ->orderBy('id', 'desc')
                ->get();
        });
         Plans::with('permissions','business_types.businessType')->where('is_active', true)->get();
        $executionTime = microtime(true) - $startTime;
        return response()->json([
            'status' => true,
            'message' => 'Plan List',
            'source' => $fromCache ? 'Cache' : 'Database',
            'response_time' => round($executionTime, 4) . ' sec',
            'data' => $data,
            
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'required',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'created_by'    => 'nullable'
        ]);
        $data['slug'] = Str::slug($data['name']);
        try {
            $plan = Plans::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Plan Created Successfully',
                'data' => $plan
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

        // Get Plan
        $plan = Plans::findOrFail($id);
        $startTime = microtime(true);
        $cacheKey = "plan_details_{$id}";
        $fromCache = Cache::tags(['plan_details'])->has($cacheKey);
         $plans = Cache::tags(['plan_details'])->remember($cacheKey, 600, function () use ($id,$plan) {
            // return Plans::findOrFail($id);
        //  });
        // Get Plan Permission IDs
        $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
            ->pluck('permission_id')
            ->toArray();

        // Get Permission Names
        $permissionNames = PlanPermission::whereIn('id', $planPermissions)
            ->select([
                'id',
                'permission_name',
                'slug',
                'description'
            ])
            ->get();
            $user = Auth::user()->id;
            
        // Get Sidebar Permissions (IMPORTANT FIX)
        $sidebarPermissions = PlanPermission::with('sidebarPermissions')
            ->whereIn('id', $planPermissions)
            ->get()
            ->flatMap(function ($perm) {
                return $perm->sidebarPermissions;
            })
            ->unique('id') // remove duplicates
            ->values();  
        return [
            'status' => true,
            'message' => 'Plan Details',

            'Single Plan' => $plan,

            'permissions_id' => $planPermissions,

            'permissionNames' => $permissionNames,

            'business_types' => $plan->business_types()->with('businessType')->get(),

            //  FINAL SIDEBAR PERMISSIONS
            'customer_sidebar_permission' => $sidebarPermissions,

        ];

         });
         $exucationTime = microtime(true) - $startTime;
         $plans['source'] = $fromCache ? 'Cache' : 'Database';
         $plans['response_time'] = round($exucationTime, 4) . ' sec';
        return response()->json($plans);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'required',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'created_by'    => 'nullable'
        ]);
        try {
            $plan = Plans::findOrFail($id);
            $plan->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Plan Updated Successfully',
                'data' => $plan
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
            $plan = Plans::findOrFail($id);
            $plan->delete();
            return response()->json([
                'status' => true,
                'message' => 'Plan Deleted Successfully',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function trashed()
    {
        try {
            $plan = Plans::onlyTrashed()->get();
            return response()->json([
                'status' => true,
                'message' => 'Plan List',
                'data' => $plan
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
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->restore();
            return response()->json([
                'status' => true,
                'message' => 'Plan Restored Successfully',
                'data' => $plan
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
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->forceDelete();
            return response()->json([
                'status' => true,
                'message' => 'Plan Deleted Permanently',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

   public function search(Request $request)
{
    try {
        $search = $request->search;
        $startTime = microtime(true);
        $cacheKey = 'plans_search_' . $search;
        $fromCache = Cache::tags(['plans_search'])->has($cacheKey);
        $plans = Cache::tags(['plans_search'])->remember($cacheKey, 600, function () use ($search) {
            
        if ($search == 'all') {
            return  Plans::with('permissions', 'business_types.businessType')
                ->where('is_active', true)
                ->get();
        } else {
            return Plans::with('permissions', 'business_types.businessType')
                ->where('is_active', true)
                ->whereHas('business_types', function ($q) use ($search) {
                    $q->where('business_type_id', $search);
                })
                ->get();
        }
    });
        $executionTime = microtime(true) - $startTime;
        return response()->json([
            'status' => true,
            'message' => 'All Plan List',
            'source' => $fromCache ? 'Cache' : 'Database',
            'response_time' => round($executionTime, 4) . ' sec',
            'data' => $plans
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}

public function recentPlan($id){
    
    $user = Auth::user()->id;
    if(!$id){
        return response()->json([
            'status' => false,
            'message' => 'id is null'
        ]);
    }
    if($user != $id){
        return response()->json([
            'status' => false,
            'message' => 'Unauthorized user'
        ]);
    }
    try{
    $customer = Customers::findOrFail($id);
    $plan = Plans::findOrFail($customer->plan_id);
    $lastPlanPurchase = PlanPurchaseHistory::where('user_id', $customer->id)
        ->where('plan_id', $customer->plan_id)
        ->latest()
        ->first();
    $startDate = Carbon::parse($lastPlanPurchase->start_date)->startOfDay();
    $endDate   = Carbon::parse($lastPlanPurchase->end_date)->startOfDay();
    $remaningDays = max(0, now()->startOfDay()->diffInDays($endDate));
    $duration = max(1, $startDate->diffInDays($endDate));
    $perDayPrice = $lastPlanPurchase->price / $duration;
    // Remaining value
    $remainingAmount = $perDayPrice * $remaningDays;
    Cache::tags(['plan_purchase_history_user_' . $user])->flush();
    return response()->json([
        'status' => true,
        'message' => 'Recent Plan and remaining days',
        'data' => [
            'plan' => $plan,
            'lastPlanPurchase' => $lastPlanPurchase,
            'start_day' => $startDate,
            'end_day' => $endDate,
            'total_duration'=> $duration,
            'remainingDays' => $remaningDays,
            'perDayPrice' => $perDayPrice,
            'remainingAmount' => $remainingAmount
        ]
    ]);
    }catch(\Exception $e){
        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
    
}
}
