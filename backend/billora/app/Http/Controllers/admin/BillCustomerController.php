<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use Illuminate\Support\Facades\Auth;
use App\Models\Customers;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

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
            ->orderBy('created_at', 'desc')
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
            'user_id'      => 'required',
            'name'          => 'nullable',
            'email'         => 'nullable',
            'phone'         => 'required',
            'address'       => 'nullable',
            'city'          => 'nullable',
            'gst_number'    => 'nullable',
            'created_by'    => 'required'
        ]);
        // $data['admin_id'] =$request->user_id;
        $user = Auth::user()->id;
         if($user != $data['user_id']){
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized, You are not allowed to perform this action,logged in user not mathched with our data',
            ]);
        }
        //check active plan
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        try {
            $billCustomer = BillCustomer::create([
            'admin_id'      => $data['user_id'],
            'name'          => $data['name'],
            'email'         => $data['email'],
            'phone'         => $data['phone'],
            'address'       => $data['address'],
            'city'          => $data['city'],
            'created_by'    => $data['created_by']
            ]
                );
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
            //check active plan
             $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                    return response()->json([
                        'status' => false,
                        'message' =>'You do not have any active plan. Please upgrade your plan.'
                    ]);
            }
            $billCustomer = BillCustomer::where('id', $id)->where('admin_id', $user)->first();
             // $billCustomer = BillCustomer::with('paymentHistories')->findOrFail($id);
            $query = BillPaymentHistory::where('admin_id', $user)->where('customer_id', $billCustomer->id);
            if (request()->start_date) {
                $query->whereDate('created_at', '>=', request()->start_date);
            }

            if (request()->end_date) {
                $query->whereDate('created_at', '<=', request()->end_date);
            }

            // $data = $query->latest()->get();
            $data = $query->orderBy('id', 'desc')->get();
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
            'name'      => 'nullable',
            'email'     => 'nullable',
            'phone'     => 'required',
            'address'   => 'nullable',
            'city'      => 'nullable',
            'gst_number'    => 'nullable',
 
        ]);
        try {
        $user = Auth::user()->id;
        //check active plan
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        //check user
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
        //check active plan 
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        //check user
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
            // check active plan 
            $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                    return response()->json([
                        'status' => false,
                        'message' =>'You do not have any active plan. Please upgrade your plan.'
                    ]);
            }
            //check user
            if($user != $data['user_id']){
                return response()->json([
                    'status' =>false,
                    'message' => "Unauthorized user"
                ]);
            }
            $billCustomer = BillCustomer::withTrashed()->where('id', $id)->where('admin_id', $data['user_id'])->firstOrFail();
            if($billCustomer == null){
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
            //check active plan
             $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                    return response()->json([
                        'status' => false,
                        'message' =>'You do not have any active plan. Please upgrade your plan.'
                    ]);
            }
            $billCustomer = BillCustomer::withTrashed()->where('admin_id',$user)->where('id',$id)->first();
            if($billCustomer == null){
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
         if(!Auth::check()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
       $data = $request->validate([
            'due_payment' => 'required'
        ]);
        $user =Auth::user()->id;
        //check active plan
         $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        //check user authentication
        DB::beginTransaction();
       try{
        $billCustomer = BillCustomer::where('admin_id',$user)->where('id',$id)->firstOrFail();
        $paymentAmount = (float)$data['due_payment'];
        if ($paymentAmount > $billCustomer->due_amount) {
            return response()->json([
                'status' => false,
                'message' => 'Payment exceeds customer due amount',
                'due_amount' => $billCustomer->due_amount
            ]);
        }
        $invoices = Invoice::where('user_id', $user)
            ->where('customer_id', $billCustomer->id)
            ->where('status', '!=', 'cancelled')
            ->whereColumn('paid_amount', '<', 'total_amount')
            ->orderBy('created_at', 'asc')
            ->lockForUpdate()
            ->get();
        $remainingPayment = $paymentAmount;
         foreach ($invoices as $invoice) {
            if ($remainingPayment <= 0) {
                break;
            }
        $invoiceDue = (float)$invoice->total_amount - (float)$invoice->paid_amount; 
        $payAmount = min($remainingPayment, $invoiceDue);  
        $newPaidAmount = (float)$invoice->paid_amount + $payAmount;
        $newDueAmount  = (float)$invoice->total_amount - $newPaidAmount;
        // Update invoice
            $invoice->update([
                'paid_amount' => $newPaidAmount,
            ]);
        $due_payment_history = BillPaymentHistory::create([
        'admin_id'=>$user,
        'invoice_id'=> $invoice->id,
        'customer_id'=> $billCustomer->id,
        'store_id'=> $invoice->store_id,
        'total_amount'=> $invoiceDue,//$invoice->total_amount,
        'paid_amount'=>$payAmount,
        'due_amount'=> $newDueAmount,
        'payment_method'=> 'Cash',
        'transaction_id'=> null,
        'created_by'=> $user,
        'remarks'=>'Due payment'

        ]);
        $remainingPayment -= $payAmount;
         }
        // $billCustomer->update([
        //     'due_amount' => ($billCustomer->due_amount - $data['due_payment'])
        // ]);
         // Update customer due amount
        $billCustomer->update([
            'due_amount' => max(
                0,
                (float)$billCustomer->due_amount - $paymentAmount
            )
        ]);
        DB::commit();
        return response()->json([
            'status'    => true,
            'message'   => 'Bill Customer due amount updated successfully',
            'data'      => $billCustomer
        ]);
       }catch(\Exception $e){
        DB::rollBack();
        return response()->json([
            'status'    => false,
            'message'   => $e->getMessage()
        ]);
       }
    }
    // public function paymentHistory($id){

    // }
}

