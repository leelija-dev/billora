<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;

class StoreController extends Controller
{
    public function index($id)
    {
        try {

            $store = Store::where('user_id', $id)->get();

            if ($store->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Does not have any data',
                    'data' => null
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Store List',
                'data' => $store
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ]);
        }
    }
    public function store(Request $request)
    {
        $store = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'gst' => 'nullable',
            'email' => 'required',
            'logo' => 'nullable',
            'mobile' => 'nullable',
            'address' => 'required',
            'city' => 'required',
            'status' => 'required',
            'created_by' => 'required'
        ]);


        try {
            $store = Store::create($store);
            return response()->json([
                'status' => true,
                'message' => 'Store Created Successfully',
                'data' => $store
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function edit($id){
        try{
        $store = Store::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'Store Details',
            'data' => $store
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }

    }
    public function update(Request $request,$id){
        $data = $request->validate([
            'name' => 'required',
            'gst' => 'nullable',
            'email' => 'required',
            'logo' => 'nullable',
            'mobile' => 'nullable',
            'address' => 'required',
            'city' => 'required',
            'status' => 'required',
        ]);
        try{
        $store = Store::findOrFail($id);
        $store->update($data);
        return response()->json([
            'status' => true,
            'message' => 'Store Updated Successfully',
            'data' => $store
        ]);

        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id){
        try{
        $store = Store::findOrFail($id);
        $store->delete();
        return response()->json([
            'status' => true,
            'message' => 'Store Deleted Successfully',
            'data' => null
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
