<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
class BillCustomerController extends Controller
{
    public function index(Request $request, $id)
    {
        $search = $request->search;
        $billCustomer = BillCustomer::where('admin_id', $id)
        ->where('name', 'like', "%$search%")
        ->orWhere('email', 'like', "%$search%")
        ->orWhere('phone', 'like', "%$search%")
        ->orWhere('address', 'like', "%$search%")
        ->orWhere('city', 'like', "%$search%")
        ->orWhere('due_amount', 'like', "%$search%")
        ->paginate(15);
        return response()->json([
            'status'    => true,
            'message'   => 'Bill Customer List',
            'data'      => $billCustomer
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'admin_id'      => 'required',
            'name'          => 'required',
            'email'         => 'nullable',
            'phone'         => 'required',
            'address'       => 'required',
            'city'          => 'nullable',
            'created_by'    => 'required'
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
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function show($id){
        try{
        $billCustomer = BillCustomer::findOrFail($id);
        // $billCustomer = BillCustomer::with('paymentHistories')->findOrFail($id);
            $query = BillPaymentHistory::where('customer_id', $billCustomer->id);
            if (request()->start_date) {
                $query->whereDate('created_at', '>=', request()->start_date);
            }

            if (request()->end_date) {
                $query->whereDate('created_at', '<=', request()->end_date);
            }

            $data = $query->latest()->get();

        return response()->json([
            'status'                => true,
            'message'               => 'Single Bill Customer',
            'data'                  => $billCustomer,
            'bill_payment_history'  => $data,
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
            'user_id'   => 'required',
            'name'      => 'required',
            'email'     => 'nullable',
            'phone'     => 'required',
            'address'   => 'required',
            'city'      => 'nullable',
 
        ]);
        try {
        $billCustomer = BillCustomer::where('id', $id)->where('admin_id', $data['user_id'])->firstOrFail();
        //   $category = Categories::where('id', $id)
        //     ->where('user_id', $data['user_id'])
        //     ->firstOrFail();
            $billCustomer->update($data);
            return response()->json([
                'status'    => true,
                'message'   => 'Bill Customer Updated Successfully',
                'data'      => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function delete(Request $request,$id){
        $data = $request->validate([
            'user_id' => 'required',
        ]);
        try {
            $billCustomer = BillCustomer::where('id', $id)->where('admin_id', $data['user_id'])->firstOrFail();
            $billCustomer->delete();
            return response()->json([
                'status'    => true,
                'message'   => 'Bill Customer Deleted Successfully',
                'data'      => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function trashed(){
        $trashedCustomers = BillCustomer::onlyTrashed()->paginate(15);
        return response()->json([
            'status'    => true,
            'message'   => 'Bill Customer Trashed List',
            'data'      => $trashedCustomers
        ]);
    }
    public function restore(Request $request,$id){
        $data = $request->validate([
            'user_id' => 'required',
        ]);
        try {
            $billCustomer = BillCustomer::withTrashed()->where('id', $id)->where('admin_id', $data['user_id'])->firstOrFail();
            $billCustomer->restore();
            return response()->json([
                'status'    => true,
                'message'   => 'Bill Customer Restored Successfully',
                'data'      => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function forceDelete($id){
        try {
            $billCustomer = BillCustomer::withTrashed()->findOrFail($id);
            $billCustomer->forceDelete();
            return response()->json([
                'status'    => true,
                'message'   => 'Bill Customer Deleted Permanently',
                'data'      => $billCustomer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function duePayment($id , Request $request){
       $data = $request->validate([
            'due_payment' => 'required'
        ]);
        $customer = BillCustomer::findOrFail($id);
        $customer->update([
            'due_amount' => ($customer->due_amount - $data['due_payment'])
        ]);
        return response()->json([
            'status'    => true,
            'message'   => 'Bill Customer due amount updated successfully',
            'data'      => $customer
        ]);
    }
}

