<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
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
}
