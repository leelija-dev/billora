<?php

namespace App\Http\Controllers;

use App\Models\PlanExpireNotification;
use App\Models\PlanPurchaseHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class PlanExpiryController extends Controller
{
    public function getExpiringPlans($id)
    {
       
        $user = Auth::user()->id;
         try{
        // $notifications = PlanExpireNotification::where('user_id', $user)
        //     ->where('type', 'json')
        //     ->orderBy('created_at', 'desc')
        //     ->get()
        //     ->map(fn($n) => json_decode($n->data, true));
        if($user != $id){
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to access this resource.'
            ]);
        }
        $notifications = PlanExpireNotification::where('user_id', $user)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'user_id' => $n->user_id,
                    'data' => json_decode($n->data, true), // decode JSON string
                    'created_at' => $n->created_at->toDateTimeString(),
                    'updated_at' => $n->updated_at->toDateTimeString(),
                ];
            });

        return response()->json([
            'notifications' => $notifications,
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'user_id' => $user,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
