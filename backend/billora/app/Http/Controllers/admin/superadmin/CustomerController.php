<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use App\Models\PlanPurchaseHistory;

class CustomerController extends Controller
{
   public function index(Request $request)
{
    $query = Customers::query();

    // Search logic
    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%$search%")
              ->orWhere('email', 'like', "%$search%")
              ->orWhere('phone', 'like', "%$search%");
        });
    }

    $customers = $query->paginate(15)->withQueryString();

    return view('admin.customers.index', compact('customers'));
}
public function plans($id){
      $customer = Customers::find($id);
      $plans = PlanPurchaseHistory::with('plan')->where('user_id',$id)->paginate(15)->withQueryString();
    return view('admin.customers.customer_plan',compact('customer','plans','id'));
}
}
