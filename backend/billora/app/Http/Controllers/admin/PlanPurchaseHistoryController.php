<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanPurchaseHistory;
use Illuminate\Support\Facades\Auth;
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
        if($user != $id){
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to access this resource.'
            ]);
        }
        $plans = PlanPurchaseHistory::where('user_id', $id)->paginate(15)->withQueryString();
        if($plans->isEmpty()){
            return response()->json([
                'status' => false,
                'message' => 'You have not purchased any plan yet.'
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'Plan purchase history',
            'data' => $plans
        ]);
    }
}
