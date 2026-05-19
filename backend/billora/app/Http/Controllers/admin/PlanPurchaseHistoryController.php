<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanPurchaseHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PlanPurchaseHistoryController extends Controller
{
    public function index($id){
       
        
        if(!Auth::check()){
            return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        $startTime = microtime(true);
        $cacheKey = "plan_purchase_history_{$user}";
        $fromCache = Cache::tags(['plan_purchase_history_user_' . $user])->has($cacheKey);
        
        if($user != $id){
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to access this resource.'
            ]);
        }
        $plans = Cache::tags(['plan_purchase_history_user_' . $user])->remember($cacheKey, 600, function () use ($user, $id) {
           return PlanPurchaseHistory::where('user_id', $id)->paginate(15)->withQueryString();
            // if($plans->isEmpty()){
            //     return response()->json([
            //         'status' => false,
            //         'message' => 'You have not purchased any plan yet.'
            //     ]);
            // }
        });
        $exucationTime = microtime(true) - $startTime;
        return response()->json([
            'status' => true,
            'message' => 'Plan purchase history',
            'source' => $fromCache ? 'Cache' : 'Database',
            'response_time' => round($exucationTime, 4) . ' sec',
            'data' => $plans
        ]);
    }
}
