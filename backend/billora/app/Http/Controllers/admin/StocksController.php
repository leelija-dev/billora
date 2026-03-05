<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stocks;
use App\Models\Products;
use App\Models\Unit;
class StocksController extends Controller
{

    public function index() // all stocks data
    {
        // $user = auth()->customer();
        try{
        $stocks = Stocks::paginate(15);
        return response()->json([
            'status' => true,
            'message' => 'Stock List',
            'data' => $stocks
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function create(){
        $products = Products::all();
        $units = Unit::all();
        return response()->json([
            'status' => true,   
            'message' => 'Stock Create',
            'data' => ['products'=>$products,'units'=>$units]
        ]);
    }
    public function store(Request $request){
        $stocks =$request->validate([
            'user_id'=>'required',
            'product_id'=>'required',
            'quantity'=>'required',
            'selling_price'=>'required',
            'product_package_id'=>'nullable',
            'purchase_price'=>'nullable',
            'unit_id'=>'nullable',
            'created_by'=>'nullable'
            
        ]);
        try{
        $stock = Stocks::create($stocks);
        $stocks = Stocks::all();
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
        $stock=Stocks::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'edit stock',
            'data' => $stock
        ]);
    }

    public function update($id,Request $request){
        try{
            $data=$request->validate([
                'user_id'=>'required',
                'product_id'=>'required',
                'purchase_price'=>'nullable',
                'selling_price'=>'required',
                'unit_id'=>'required',
            ]);
            $stock = Stocks::findOrFail('id',$id);

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
        public function destroy($id,$user_id){
            try{
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
                'user_id'=>'required',
            ]);
            try{
            $stock = Stocks::where('id', $id)
            ->where('user_id', $data['user_id'])
            ->firstOrFail();

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
