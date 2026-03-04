<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BillCustomer;

class BillCustomerController extends Controller
{
    public function index()
    {
        $billCustomer = BillCustomer::all();
        return response()->json([
            'status' => true,
            'message' => 'Bill Customer List',
            'data' => $billCustomer
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'admin_id' => 'required',
            'name' => 'required',
            'email' => 'nullable',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'nullable',
            'created_by' => 'required'
        ]);
        try {
            $billCustomer = BillCustomer::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Bill Customer Created Successfully',
                'data' => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function show($id){
        try{
        $billCustomer = BillCustomer::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'Single Bill Customer',
            'data' => $billCustomer
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $id){
        $data = $request->validate([
            'name' => 'required',
            'email' => 'nullable',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'nullable',
 
        ]);
        try {
            $billCustomer = BillCustomer::findOrFail($id);
            $billCustomer->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Bill Customer Updated Successfully',
                'data' => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id){
        try {
            $billCustomer = BillCustomer::findOrFail($id);
            $billCustomer->delete();
            return response()->json([
                'status' => true,
                'message' => 'Bill Customer Deleted Successfully',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function restore($id){
        try {
            $billCustomer = BillCustomer::withTrashed()->findOrFail($id);
            $billCustomer->restore();
            return response()->json([
                'status' => true,
                'message' => 'Bill Customer Restored Successfully',
                'data' => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function forceDelete($id){
        try {
            $billCustomer = BillCustomer::withTrashed()->findOrFail($id);
            $billCustomer->forceDelete();
            return response()->json([
                'status' => true,
                'message' => 'Bill Customer Deleted Permanently',
                'data' => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}

