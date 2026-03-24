<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Notifications\VerifyEmailNotification;
class CustomerController extends Controller
{


    public function index() // check logged in user
    {
        // $customer = Customers::id()->get();
        $customer = Auth::user();
        return response()->json([
            'status' => true,
            'message' => 'User List',
            'data' => $customer
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'nullable|string',
            'email'         => 'required|email',
            'phone'         => 'nullable',
            'password'      => 'required',
            'company_name'  => 'nullable',
            'gst_number'    => 'nullable',
            'address'       => 'nullable',
            'city'          => 'nullable',
            'state'         => 'nullable',
            'country'       => 'nullable',
            'pincode'       => 'nullable',
            'created_by'    => 'nullable'

        ]);
         $data['verification_token'] = Str::random(64);
        $data['password'] = Hash::make($data['password']);
        $customer = Customers::create($data);
        $customer->notify(new VerifyEmailNotification($data['verification_token']));
        return response()->json([
            'status' => true,
            'message' => 'User Register Successfully',
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
// Block login if not verified
if (is_null($user->email_verified_at)) {
    return response()->json([
        'status' => false,
        'message' => 'Please verify your email before login'
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
    $user = $request->user();

    if (!$user) {
        return response()->json([
            'status' => false,
            'message' => 'User not authenticated'
        ], 401);
    }

    $user->currentAccessToken()->delete();

    return response()->json([
        'status' => true,
        'message' => 'Logout successful'
    ]);
}
public function verifyEmail($token)
{
    $customer = Customers::where('verification_token', $token)->first();

    if (!$customer) {
        return "Invalid or expired token";
    }

    $customer->update([
        'email_verified_at' => now(),
        'verification_token' => null
    ]);

    return "Email verified successfully. You can now login.";
}
}
