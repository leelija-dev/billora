<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
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
}
