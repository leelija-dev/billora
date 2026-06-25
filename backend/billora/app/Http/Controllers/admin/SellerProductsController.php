<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Seller;
use App\Models\SellerPaymentHistory;
use App\Models\SellerProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerProductsController extends Controller
{
public function store(Request $request){
        $user = Auth::user()->id;
    try{
        $data = $request->validate([
            'user_id'        => 'required',
            'seller_id'      => 'required',
            'product_id'     => 'nullable',
            'stock_id'       => 'nullable',  
            'qty'            => 'nullable',
            'purchase_price' => 'nullable',
            'gst_percentage' => 'nullable',
            'total_amount'   => 'nullable',
            'paid_amount'    => 'nullable',
            'invoice_number' => 'nullable',   
            'invoice_date'   => 'nullable',
            'invoice_image'  => 'nullable',
             
        ]);
        if($data['user_id'] != $user) {
            return response()->json([
                'status' => false, 
                'message' => 'Unauthorized user'
                ]);
        }
        $seller = Seller::where('id', $data['seller_id'])->where('user_id', $user)->firstOrFail();
        if(!$seller) {
            return response([
                'status' => false,
                'message' => 'Seller not found'
                
            ]);
        }
        $sellerProducts = SellerProducts::create($data);
        return response()->json([
            'status' => true,
            'message' => 'Seller product added successfully',
            'sellerProducts' => $sellerProducts
        ]);

        
    }catch(\Exception $e){
        return response()->json([
            'status' => false, 
            'message' => $e->getMessage()
            ]);
    }
}

public function sellerProducts(Request $request, $id){
    $user = Auth::user()->id;
    $search = $request->search;
    $customer = Customers::findOrFail($user);
    if(!$customer){
        return response()->json([
           'status' =>false,
           'message' => 'Customer not found/unauthorized user' 
        ]);
    }
    try{
        $seller = Seller::where('id', $id)->where('user_id', $user)->firstOrFail();
        if(!$seller){
            return response()->json([
                'status' => false,
                'message' => 'Seller not found'
            ]);
        }
        $sellerProducts = SellerProducts::where('seller_id',$id)->where('user_id', $user)->with('products', 'stocks','seller')
        ->when($search, function ($query) use ($search) {
                $query->whereHas('products', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('sku', 'LIKE', "%{$search}%");
                });
        })->paginate(15);
        $sellerPaymentHistory = SellerPaymentHistory::where('seller_id', $id)->where('user_id', $user)->paginate(15);
        return response()->json([
            'status' => true,
            'message' => 'Seller products',
            'sellerProducts' => $sellerProducts,
            'sellerPaymentHistory' => $sellerPaymentHistory
        ]);
    }catch(\Exception $e){
        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
}
