<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\Customers;
use App\Models\PlanPurchaseHistory;
use App\Models\Plans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
class DashboardController extends Controller
{
  public function index(Request $request){
    if ($request->type == 'today') {

        $start = Carbon::today();
        $end = Carbon::today()->endOfDay();

    } elseif ($request->type == 'custom') {

        $start = Carbon::parse($request->start_date)->startOfDay();
        $end = Carbon::parse($request->end_date)->endOfDay();

    } else {

        // Default This Month
        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->endOfMonth();
    }
    $customerCount = Customers::whereBetween('created_at', [$start, $end])->count();
    $planPurchaseCount = PlanPurchaseHistory::where('payment_status', 'success')
        ->whereBetween('created_at', [$start, $end])
        ->count();
        $contactCount = ContactUs::whereBetween('created_at', [$start, $end])
        ->count();
         // AJAX Response
    if ($request->ajax()) {

        return response()->json([
            'status' => true,
            'labels' => [
                'Customers',
                'Plan Purchases',
                'Contacts'
            ],
            'data' => [
                $customerCount,
                $planPurchaseCount,
                $contactCount
            ]
        ]);
    }
        $totalUsers = Customers::orderBy('id','desc')->get();
        $user = Auth::guard('admin')->user();
        $totalPlanPurchase = PlanPurchaseHistory::where('payment_status','success')->orderBy('id','desc')->get();
        $toalPlan = Plans::orderBy('id','desc')->get();
        $contactUs = ContactUs::orderBy('id','desc')->get();
        // return view('admin.dashboard',compact('totalUsers','user','totalPlanPurchase','toalPlan','contactUs'));
        return view('admin.dashboard', compact(
        'totalUsers',
        'user',
        'totalPlanPurchase',
        'toalPlan',
        'contactUs',
        'customerCount',
        'planPurchaseCount',
        'contactCount'
    ));
    }
}
