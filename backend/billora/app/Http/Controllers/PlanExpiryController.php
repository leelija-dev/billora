<?php

namespace App\Http\Controllers;

use App\Models\BillCustomer;
use App\Models\Customers;
use App\Models\PlanExpireNotification;
use App\Models\PlanPurchaseHistory;
use App\Models\Stocks;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        $customer =  Customers::findOrFail($user);
        $due_customer = BillCustomer::where('admin_id',$user)->where('due_amount','>',0)->get();
        $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

        $hasStockPermission = in_array('stock-management', $permissions);
        $lowStocks = collect();
        if($hasStockPermission){
        $lowStocks = Stocks::where('user_id', $user)
            ->where('quantity', '<=', 5)
            ->with('product:id,name,sku')
            ->get();
        }
        $notification = PlanExpireNotification::where('user_id', $user)
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
            $notifications['planExpireReminder'] = $notification;
            if($hasStockPermission){
            $notifications['lowStocks'] = $lowStocks;
            }
            $notifications['dueCustomer'] = $due_customer;
            
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
