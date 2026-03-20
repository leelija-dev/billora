<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stocks;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Customers;
use Illuminate\Support\Facades\Auth;
class StocksController extends Controller
{

  public function index(Request $request)
{
    try {

        $user = Auth::user()->id; // authenticated user
        $search = $request->search;

        $stocks = Stocks::with('product')
            ->where('user_id', $user)
            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%$search%")
                      ->orWhere('selling_price', 'like', "%$search%")
                      ->orWhere('purchase_price', 'like', "%$search%")
                      ->orWhereHas('product', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%$search%");
                      });
                });

            })
            ->paginate(15);

        return response()->json([
            'status' => true,
            'message' => 'Stock List',
            'data' => $stocks
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
    public function create(){
        try{
        $user = Auth::user()->id;
        // cheeck active plan
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        $products = Products::where('user_id', $user)->get();
        $units = Unit::where('user_id', $user)->get();
        return response()->json([
            'status' => true,   
            'message' => 'Stock Create',
            'data' => ['products'=>$products,'units'=>$units]
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request){
        $stocks =$request->validate([
            'product_id'        =>'required',
            'quantity'          =>'required',
            'selling_price'     =>'required',
            'product_package_id'=>'nullable',
            'purchase_price'    =>'nullable',
            'unit_id'           =>'nullable',
            
        ]);
        try{
            //check authenticated user
        if(!Auth::check()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        //check active plan
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        $stocks['user_id'] = $user;
        $stocks['created_by'] = $user;
        $stock = Stocks::create($stocks);
        $stocks = Stocks::where('user_id', $user)->get();
        return response()->json([
            'status' => true,
            'message' => 'Stock created successfully',
            'data' => $stocks
        ]);

        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }

    }   
    public function edit($id){
        try{
            //check authenticated user
            if(!Auth::check()){
                return response()->json([
                   'status' => false,
                   'message' => 'Authentication required. Please login first.' 
                ]);
            }
        $user = Auth::user()->id;
        //check active plan
        $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }

        $stock = Stocks::where('user_id', $user)->where('id', $id)->first();
        return response()->json([
            'status' => true,
            'message' => 'edit/show stock',
            'data' => $stock
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($id,Request $request){
        try{
            if(!Auth::check()){
                return response()->json([
                   'status' => false,
                   'message' => 'Authentication required. Please login first.' 
                ]);
            }
            $user = Auth::user()->id;
            //check active plan
            $customer =  Customers::findOrFail($user);
                if($customer->plan_id == null || $customer->is_active == false){
                        return response()->json([
                            'status' => false,
                            'message' =>'You do not have any active plan. Please upgrade your plan.'
                        ]);
                }
            $data=$request->validate([
                'product_id'    =>'required',
                'purchase_price'=>'nullable',
                'selling_price' =>'required',
                'unit_id'       =>'required',
            ]);
            $stock = Stocks::where('user_id', $user)->where('id', $id)->first();

            $stock->update($data);

            return response()->json([
                'status' => true,
                'message' => 'edit stock',
                'data' => $stock
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }        
        }
        public function destroy(Request $request, $id){
            try{
                $data=$request->validate([
                    'user_id'=>'required'
                ]);
                $user_id = $data['user_id'];
                //check authenticated user
                if(!Auth::check()){
                    return response()->json([
                       'status' => false,
                       'message' => 'Authentication required. Please login first.' 
                    ]);
                }
                //check active plan
                $customer =  Customers::findOrFail($user_id);
                if($customer->plan_id == null || $customer->is_active == false){
                        return response()->json([
                            'status' => false,
                            'message' =>'You do not have any active plan. Please upgrade your plan.'
                        ]);
                }
            $user = Auth::user()->id;
            $stock = Stocks::where('id', $id)
            ->where('user_id', $user_id)
            ->firstOrFail();
            $stock->delete();
            return response()->json([
                'status' => true,
                'message' => 'Stock Deleted Successfully',
                'data' => $stock
            ]);
            }catch(\Exception $e){
                return response()->json([
                    'status' => false,
                    'message' => $e->getMessage()
                ]);
            }
        }
        public function addStock(Request $request,$id){
            $data=$request->validate([
                'quantity'=>'required',
                'user_id' =>'required',
            ]);
            try{
                //check authenticated user
                if(!Auth::check()){
                    return response()->json([
                       'status' => false,
                       'message' => 'Authentication required. Please login first.' 
                    ]);
                }
                $user = Auth::user()->id;
                //check active plan
                $customer =  Customers::findOrFail($user);
                if($customer->plan_id == null || $customer->is_active == false){
                        return response()->json([
                            'status' => false,
                            'message' =>'You do not have any active plan. Please upgrade your plan.'
                        ]);
                }
            $stock = Stocks::where('id', $id)
            ->where('user_id', $data['user_id'])
            ->first();

            $stock->update([
                'quantity'=>((float)$stock->quantity + (float)$data['quantity']),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Stock Updated Successfully',
                'data' => $stock
            ]);

            }catch(\Exception $e){
                return response()->json([
                    'status' => false,
                    'message' => $e->getMessage()
                ]);
            }
        }
    }
