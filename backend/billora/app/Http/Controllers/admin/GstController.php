<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;
use App\Models\GstCollection;
use Illuminate\Support\Facades\DB;
class GstController extends Controller
{
    public function index($id){   // id = register user id 
        $user = Auth::user()->id;
        if($user != $id){
            return response()->json([
                'status' =>false,
                'message' => 'unauthorized user' 
            ]);
        }
        $collection = GstCollection::where('user_id', $id)->get();
        // if($collection->isEmpty()){
        //     return response()->json([
        //         'status' =>false,
        //         'message' => 'gst collection not found',
        //         'user_id' => $id
        //     ]);
        // }
        $data = GstCollection::where('user_id',$id)->where('invoice_status','completed')->orderBy('created_at', 'desc')->get();
        $totalGst = GstCollection::where('user_id',$id)->sum('selling_gst_amount'); 
        $dueGstPayGovt = GstCollection::where('user_id', $id)->where('govt_pay_status', false)->where('invoice_status','completed')->sum(DB::raw('selling_gst_amount * quantity'));
        // $allProducts = GstCollection::where('user_id',$id)->get();
       $allProducts = GstCollection::where('user_id', $id)
            ->select(
                'product_id',

                // Quantity
                DB::raw('SUM(quantity) as total_quantity'),

                // Purchase
                DB::raw('SUM(purchase_price * quantity) as total_purchase_price'),
                DB::raw('SUM(purchase_gst_amount * quantity) as total_purchase_gst'),

                // Selling
                DB::raw('SUM(selling_price * quantity) as total_selling_price'),
                DB::raw('SUM(selling_gst_amount * quantity) as total_selling_gst'),

                // Discount
                // DB::raw('SUM(selling_discount_percentage) as total_discount_percentage'),

                // Profit
                // DB::raw('SUM((selling_price - purchase_price) * quantity) as total_profit'),

                // Total entries
                DB::raw('COUNT(*) as total_products')
            )
            ->orderBy('created_at', 'desc')
            ->groupBy('product_id')
            // ->with('product')
            ->get();
        return response()->json([
            'status' =>true,
            'message' => 'gst collection list',
            'Total GST' => $totalGst,
            'Govt GST Due' => $dueGstPayGovt,
            'data' => $data,
            'all products'=> $allProducts,
            

        ]);
    }
    public function productDetails($id){
        $user = Auth::user()->id;
        $allProducts = GstCollection::where('user_id', $user)->where('product_id', $id)->with('product')->get();
        if($allProducts->isEmpty()){
            return response()->json([
                'status' =>false,
                'message' => 'gst collection product not found',
                'product_id' => $id
            ]);
        }
        return response()->json([
            'status' =>true,
            'message' => 'gst collection product list',
            'all products'=> $allProducts
        ]);
    }
    public function updateStatus($id)   // id = gst collection id
    {
        $user = Auth::user()->id;
        $product = GstCollection::where('user_id', $user)->where('id', $id)->first(); 
        $product->update([
            'govt_pay_status' => true,
            
        ]);
        return response()->json([
            'status' => true,
            'message' => 'status updated successfully'
        ]);
    }
}
