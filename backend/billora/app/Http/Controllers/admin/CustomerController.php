<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{


    public function index() // check logged in user
    {
        // $customer = Customers::id()->get();
        $customer = Auth::user()->id;
        return response()->json([
            'status' => true,
            'message' => 'User List',
            'data' => $customer
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required',
            'password' => 'required',
            'email_varified_at' => 'nullable',
            'remember_token' => 'nullable',
            'company_name' => 'nullable',
            'gst_number' => 'nullable',
            'address' => 'nullable',
            'city' => 'required',
            'state' => 'required',
            'country' => 'required',
            'pincode' => 'required',
            'created_by' => 'nullable'

        ]);
        $data['password'] = Hash::make($data['password']);
        $customer = Customers::create($data);

        return response()->json([
            'status' => true,
            'message' => 'User Created Successfully',
            'data' => $customer
        ]);
    }
//    public function login(Request $request) //web based 
// {
//     $request->validate([
//         'email' => 'required|email',
//         'password' => 'required'
//     ]);

//     $user = Customers::where('email', $request->email)->first();

//     if (!$user || !Hash::check($request->password, $user->password)) {
//         return response()->json([
//             'status' => false,
//             'message' => 'Invalid credentials'
//         ]);
//     }

//     Auth::login($user); // create session

//     return response()->json([
//         'status' => true,
//         'message' => 'Login successful',
//         'user' => $user
//     ]);
// }

public function login(Request $request)  //postman
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = Customers::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'User not found'
        ]);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'status' => false,
            'message' => 'Invalid password'
        ]);
    }

    $token = $user->createToken('customer-token')->plainTextToken;

    return response()->json([
        'status' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);
}
public function logout(Request $request)
{
    // Print logged-in user for debugging
    return response()->json([
        'status' => true,
        'message' => 'Logout successful',
        'user' => $request->user() // should show user object now
    ]);

    // Once confirmed, you can safely delete the token:
    // $request->user()->currentAccessToken()->delete();
}
}
