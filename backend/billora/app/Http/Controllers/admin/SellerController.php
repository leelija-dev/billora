<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerController extends Controller
{
    public function index($id)
    {
        $user = Auth::user()->id;
        if ($user != $id) {
            return response([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        try {
            $seller = Seller::where('user_id', $id)->get();
            return response([
                'status' => true,
                'message' => 'seller list',
                'sellers' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request) {
        $user = Auth::user()->id;
        $data = $request->validate([
            'user_id' => 'required',
            'name' =>  'required',
            'email' => 'nullable|email',
            'phone' => 'nullable',
            'gst_number' =>'nullable',
            'address' => 'nullable',
            'city' => 'nullable',
            'state' => 'nullable',
            'pincode' => 'nullable',
            'due_amount' => 'nullable',
            
        ]);
        try{
        if($data['user_id'] != $user) {
            return response([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        $customer = Customers::findOrFail($user);
        if(!$customer){
            return response([
                'status' => false,
                'message' => 'Customer not found'
            ]);
        }

        $seller = Seller::create($data);
        return response([
            'status' => true,
            'message' => 'Seller created successfully',
            'seller' => $seller
        ]);
        }catch(\Exception $e){
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $id) {
        $user = Auth::user()->id;
        try{
        $data = $request->validate([
            'user_id' => 'required',
            'name' =>  'required',
            'email' => 'nullable|email',
            'phone' => 'nullable',
            'gst_number' =>'nullable',
            'address' => 'nullable',
            'city' => 'nullable',
            'state' => 'nullable',  
            'pincode' => 'nullable',
        ]);
        if($user != $data['user_id']) {
            return response([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
        $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
        if(!$seller){
            return response([
                'status' => false,
                'message' => 'Seller not found'
            ]);
        }
        $seller->update($data);
        return response([
            'status' => true,
            'message' => 'Seller updated successfully',
            'seller' => $seller
        ]);
        }catch(\Exception $e){
            return response([
                'status' =>false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function edit($id){
        $user = Auth::user()->id;
        try{
            $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
            if(!$seller){
                return response([
                    'status' => false,
                    'message' => 'Seller not found'
                ]);
            }
            return response([
                'status' => true,
                'message' => 'Seller details',
                'seller' => $seller
            ]);
        }catch(\Exception $e){
            return response([
                'status' =>false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id){
        $user = Auth::user()->id;
        try{
        $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
        if(!$seller){
            return response([
                'status' => false,
                'message' => 'Seller not found'
            ]);
        }
        $seller->delete();
        return response([
            'status' => true,
            'message' => 'Seller deleted successfully',
            'seller' => $seller
        ]);
        }catch(\Exception $e){
            return response([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function singleSeller($id)
    {
        $user = Auth::user()->id;
        try {
            $customer =  Customers::findOrFail($user);
            if (!$customer) {
                return response([
                    'status' => false,
                    'message' => 'unauthorized user'
                ]);
            }
            $seller = Seller::where('id', $id)->where('user_id', $user)->with('sellerProducts')->firstOrFail();
            if (!$seller) {
                return response([
                    'status' => false,
                    'message' => 'Seller not found!'
                ]);
            }
            return response([
                'status' => true,
                'message' => 'Single seller details',
                'seller' => $seller
            ]);
        } catch (\Exception $e) {
            return response([
                'status' => false,  
                'message' => $e->getMessage()
            ]);
        }
    }
}
