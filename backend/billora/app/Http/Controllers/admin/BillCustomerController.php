<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use Illuminate\Support\Facades\Auth;
class BillCustomerController extends Controller
{
    public function index(Request $request, $id)
    {
        $user = Auth::user()->id;
        if($user != $id){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized, You are not allowed to perform this action,logged in user not mathched with our data',
            ]);
        }
        $search = $request->search;
        $billCustomer = BillCustomer::where('admin_id', $id)
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('address', 'like', "%$search%")
                    ->orWhere('city', 'like', "%$search%")
                    ->orWhere('due_amount', 'like', "%$search%");
            })
            ->paginate(15);
        if ($billCustomer->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Does not have any data',
                'data' => null
            ]);
        }
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
        $user = Auth::user()->id;
         if($user != $data['admin_id']){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized, You are not allowed to perform this action,logged in user not mathched with our data',
            ]);
        }
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
            $user = Auth::user()->id;   
            $billCustomer = BillCustomer::where('id', $id)->where('admin_id', $user)->first();
             // $billCustomer = BillCustomer::with('paymentHistories')->findOrFail($id);
            $query = BillPaymentHistory::where('admin_id', $user)->where('customer_id', $billCustomer->id);
            if (request()->start_date) {
                $query->whereDate('created_at', '>=', request()->start_date);
            }

            if (request()->end_date) {
                $query->whereDate('created_at', '<=', request()->end_date);
            }

            $data = $query->latest()->get();
            if (!$billCustomer) {
                return response()->json([
                    'status' => false,
                    'message' => 'Customer not found'
                ], 404);
            }
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
        $user = Auth::user()->id;
        if($user != $data['user_id']){
            return response()->json([
                'status' =>true,
                'message' =>"Unauthorized user"
            ]);
        }
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
        $user = Auth::user()->id;
        if($user != $data['user_id']){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized user'
            ]);
        }
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
        $user = Auth::user()->id;
        $trashedCustomers = BillCustomer::onlyTrashed()->where('admin_id', $user)->paginate(15);
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
            $user = Auth::user()->id;
            if($user != $data['user_id']){
                return response()->json([
                    'status' =>false,
                    'message' => "Unauthorized user"
                ]);
            }
            $billCustomer = BillCustomer::withTrashed()->where('id', $id)->where('admin_id', $data['user_id'])->firstOrFail();
            if($billCustomer->isEmpty()){
                return response()->json([
                    'status' =>true,
                    'message' => "Customer not found!"
                ]);
            }
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
            $user = Auth::user()->id;
            $billCustomer = BillCustomer::withTrashed()->where('admin_id',$user)->where('id',$id)->first();
            if($billCustomer->isEmpty()){
                return response()->json([
                    'status' => true,
                    'message' => "Customer not found!"
                ]);
            }
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
        $user =Auth::user()->id;
        if(!Auth::check()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $customer = BillCustomer::where('admin_id',$user)->where('id',$id)->first();
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

