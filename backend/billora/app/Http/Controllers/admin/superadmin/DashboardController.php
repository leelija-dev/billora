<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\Customers;
use App\Models\PlanPurchaseHistory;
use App\Models\Plans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class DashboardController extends Controller
{
    public function index(){
        $totalUsers = Customers::orderBy('id','desc')->get();
        $user = Auth::guard('admin')->user();
        $totalPlanPurchase = PlanPurchaseHistory::where('payment_status','success')->orderBy('id','desc')->get();
        $toalPlan = Plans::orderBy('id','desc')->get();
        $contactUs = ContactUs::orderBy('id','desc')->get();
        return view('admin.dashboard',compact('totalUsers','user','totalPlanPurchase','toalPlan','contactUs'));
    }
}
