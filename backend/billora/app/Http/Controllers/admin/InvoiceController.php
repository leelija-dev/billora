<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;
use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Stocks;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\Store;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
class InvoiceController extends Controller
{
    public function index()
    {
        try{
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
             $customer =  Customers::findOrFail($user);
            if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
        $products = Products::where('user_id', $user)->with(['brand', 'category', 'unit', 'stocks'])
            ->where('is_active', true)
            ->whereHas('stocks')
            ->get();
        $customers = BillCustomer::where('admin_id', $user)->get();
        $stores = Store::where('user_id', $user)->get();
        return response()->json([
            'status'    => true,
            'message'   => 'Products and Customers List',
            'products'  => $products,
            'customers' => $customers,
            'stores'    => $stores
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }


    public function store(Request $request)  // bill generate data store
    {
        if(!Auth::check()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        
        $request->validate([
            "user_id"       => 'required',
            "customer_id"   => 'required|exists:bill_customer,id',
            "store_id"      => 'required|exists:store,id',
            "paid_amount"   => 'required|numeric|min:0',
            "created_by"    => 'required',
        ]);

        DB::beginTransaction();
        $customer =  Customers::findOrFail($request->user_id);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        try {

            $items = $request->items;

            $totalAmount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }

            // Store invoice
            $invoice = Invoice::create([
                'user_id'       => $request->user_id,
                'customer_id'   => $request->customer_id,
                'store_id'      => $request->store_id,
                'total_amount'  => $totalAmount,
                'total_items'   => $totalItems,
                'paid_amount'   => $request->paid_amount,
                'created_by'    => $request->created_by,
                'status'        => 'completed'
            ]);

            // Store invoice items
            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];

                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);

                InvoiceItems::create([
                    'user_id'       => $request->user_id,
                    'invoice_id'    => $invoice->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $qty,
                    'item_count'    => $qty,
                    'unit_id'       => $item['unit_id'],
                    'price'         => $price,
                    'gst'           => $item['gst'] ?? 0,
                    'discount'      => $item['discount'] ?? 0,
                    'total_price'   => $totalPrice,
                    'status'        => 'completed',
                    'created_by'    => $request->created_by
                ]);
            }
            // payment history
            BillPaymentHistory::create([
                'admin_id'       => $request->user_id,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $request->customer_id,
                'store_id'       => $request->store_id,
                'total_amount'   => $totalAmount,
                'paid_amount'    => $request->paid_amount,
                'due_amount'     => $totalAmount - $request->paid_amount,
                'payment_method' => $request->payment_method ?? 'Cash',
                'transaction_id' => null,
                'created_by'     => $request->created_by
            ]);
            // update due amount in customer 
            $customer = BillCustomer::find($request->customer_id);
            $due_amount = ($customer->due_amount + ($totalAmount - $request->paid_amount));
            $customer->update([
                'due_amount' => $due_amount
            ]);
            
            //stock update
            foreach ($items as $item) {
                $stock = Stocks::where('id', $item['stock_id'])->where('product_id', $item['product_id'])->first();
                if($stock->quantity >= $item['quantity'])
                $stock->update([
                    'quantity' => $stock->quantity - $item['quantity']
                ]);
                else{
                    return response()->json([
                        'status'    => false,
                        'message'   => 'Stock not available'
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Invoice Created Successfully',
                'invoice_id' => $invoice->id
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
    }
   public function show($id)
{
    try {

        $userId = Auth::user()->id;
        $customer =  Customers::findOrFail($userId);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        $bill = Invoice::with('invoiceItems')
            ->where('user_id', $userId)
            ->where('id', $id)
            ->first();  

        if (!$bill) {
            return response()->json([
                'status' => false,
                'message' => 'Bill not found'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Single Bill',
            'data'    => $bill
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status'  => false,
            'message' => $e->getMessage()
        ]);
    }
}
   public function billHistory(Request $request)
{
    try {
        $user = Auth::user()->id;
        $search = $request->search;

        $billHistory = Invoice::with(['invoiceItems.product'])
            ->where('user_id', $user)
            ->when($search, function ($query) use ($search) {

                $query->where('id', 'like', "%$search%")
                    ->orWhere('total_amount', 'like', "%$search%")

                    ->orWhereHas('invoiceItems', function ($q) use ($search) {
                        $q->where('price', 'like', "%$search%")
                        ->orWhere('quantity', 'like', "%$search%");
                    })

                    ->orWhereHas('invoiceItems.product', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%")
                        ->orWhere('sku', 'like', "%$search%");
                    });

            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'status'    => true,
            'message'   => 'Bill History',
            'data'      => $billHistory
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status'    => false,
            'message'   => $e->getMessage()
        ]);
    }
} 

        /* with out stock management bill generate */
    public function bill($id){
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
       $user = Auth::user()->id;
       $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
       $products = Products::with(['brand', 'category', 'unit'])
            ->where('is_active', true)
            ->where('user_id', $id)
            ->get();
        $customers = BillCustomer::where('admin_id', $id)->get();
        $stores = Store::where('user_id', $id)->get();
        return response()->json([
            'status'    => true,
            'message'   => 'Products and Customers List from product table',
            'products'  => $products,
            'customers' => $customers,
            'stores'    => $stores
        ]);
        
    }
     public function billStore(Request $request)  // bill generate data form product table with out stock management
    {
        $request->validate([
            "user_id"       => 'required|exists:customers,id',
            "customer_id"   => 'required|exists:bill_customer,id',
            "store_id"      => 'required|exists:store,id',
            "paid_amount"   => 'required|numeric|min:0',
            "created_by"    => 'required',
        ]);

        DB::beginTransaction();
        $customer =  Customers::findOrFail($request->user_id);
        if($customer->plan_id == null || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' =>'You do not have any active plan. Please upgrade your plan.'
                ]);
        }
        try {

            $items = $request->items;

            $totalAmount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }

            // Store invoice
            $invoice = Invoice::create([
                'user_id'       => $request->user_id,
                'customer_id'   => $request->customer_id,
                'store_id'      => $request->store_id,
                'total_amount'  => $totalAmount,
                'total_items'   => $totalItems,
                'paid_amount'   => $request->paid_amount,
                'created_by'    => $request->created_by,
            ]);

            // Store invoice items
            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];

                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);

                InvoiceItems::create([
                    'user_id'       => $request->user_id,
                    'invoice_id'    => $invoice->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $qty,
                    'item_count'    => $qty,
                    'unit_id'       => $item['unit_id'],
                    'price'         => $price,
                    'gst'           => $item['gst'] ?? 0,
                    'discount'      => $item['discount'] ?? 0,
                    'total_price'   => $totalPrice,
                    'status'        => 'completed',
                    'created_by'    => $request->created_by
                ]);
            }
            // payment history
            BillPaymentHistory::create([
                'admin_id'       => $request->user_id,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $request->customer_id,
                'store_id'       => $request->store_id,
                'total_amount'   => $totalAmount,
                'paid_amount'    => $request->paid_amount,
                'due_amount'     => $totalAmount - $request->paid_amount,
                'payment_method' => $request->payment_method ?? 'Cash',
                'transaction_id' => null,
                'created_by'     => $request->created_by
            ]);
            // update due amount in customer 
            $customer = BillCustomer::find($request->customer_id);
            $due_amount = ($customer->due_amount + ($totalAmount - $request->paid_amount));
            $customer->update([
                'due_amount' => $due_amount
            ]);
            
            DB::commit();

            return response()->json([
                'status'        => true,
                'message'       => 'Invoice Created Successfully',
                'invoice_id'    => $invoice->id
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }


}
