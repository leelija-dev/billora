<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\Hash;
class CustomerController extends Controller
{

    public function index()
    {
        $customer = Customers::all();
        return response()->json([
            'status' => true,
            'message' => 'User List',
            'data' => $customer
        ]);
    }
       public function store(Request $request)
    {
        $data=$request->validate([
            'name'=>'required|string',
            'email'=>'required|email',
            'phone'=>'required',
            'password'=>'required',
            'email_varified_at'=>'nullable',
            'remember_token'=>'nullable',
            'company_name'=>'nullable',
            'gst_number'=>'nullable',
            'address'=>'nullable',
            'city'=>'required',
            'state'=>'required',
            'country'=>'required',
            'pincode'=>'required',
            'created_by'=>'nullable'

        ]);
        $data['password']=Hash::make($data['password']);
        $customer = Customers::create($data);

        return response()->json([
            'status' => true,
            'message' => 'User Created Successfully',
            'data' => $customer
        ]);

    }
}
