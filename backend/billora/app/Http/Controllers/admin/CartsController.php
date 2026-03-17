<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Carts;
use App\Models\Store;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Stocks;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use Illuminate\Support\Facades\DB;
class CartsController extends Controller
{
    public function index()
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated',
            ], 401);
        }
        
        $carts = Carts::where('user_id', $user->id)->get();
        
        if ($carts->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Cart is empty',
                'data' => []
            ], 200);
        }
        
        return response()->json([
            'status' => true,
            'message' => 'Cart items retrieved successfully',
            'data' => $carts,
            'count' => $carts->count()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Error retrieving cart data',
            'error' => $e->getMessage()
        ], 500);
    }
}

   public function store(Request $request)
{
    $data = $request->validate([
        'product_id' => 'required',
        'stock_id'   => 'required',
        'quantity'   => 'required|numeric|min:1',
        'price'      => 'required|numeric'
    ]);

    try {
        $userId = Auth::user()->id;

        // Check if cart already exists
        $existingCart = Carts::where('user_id', $userId)
            ->where('product_id', $data['product_id'])
            ->where('stock_id', $data['stock_id'])
            ->first();

        if ($existingCart) {
            // Update quantity
            $existingCart->quantity += $data['quantity'];

            // Update total
            $existingCart->total = $existingCart->quantity * $existingCart->price;

            $existingCart->save();

            return response()->json([
                'status'  => true,
                'message' => 'Cart updated (quantity increased)',
                'data'    => $existingCart
            ]);
        }

        // Create new cart item
        $data['user_id'] = $userId;
        $data['created_by'] = $userId;
        $data['total'] = $data['price'] * $data['quantity'];

        $cart = Carts::create($data);

        return response()->json([
            'status'  => true,
            'message' => 'Cart created successfully',
            'data'    => $cart
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => false,
            'message' => $e->getMessage()
        ]);
    }
}

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'user_id'    => 'required',
            'product_id' => 'required',
            'stock_id'   => 'nullable',
            'quantity'   => 'required|numeric|min:1',
            'price'      => 'required|numeric'
        ]);
        $user = Auth::user()->id;
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            if ($user != $data['user_id']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ]);
            }
            
            $cart =  Carts::where('id', $id)->where('user_id', $data['user_id'])->where('product_id', $data['product_id'])->where('stock_id', $data['stock_id'])->first();

            if (!$cart) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Cart product not found'
                ]);
            }
            $cart->update([
                'quantity' => $data['quantity'],
                'price'    => $data['price'],
                'total'    => $data['price'] * $data['quantity']
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Cart updated successfully',
                'data'    => $cart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function destroy(Request $request, $id)
    {
        $data = $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'stock_id' => 'required',
        ]);
        $user = Auth::user()->id;
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            if ($user != $data['user_id']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ]);
            }
            $cart =  Carts::where('id', $id)->where('user_id', $data['user_id'])->where('product_id', $data['product_id'])->where('stock_id', $data['stock_id'])->first();

            if (!$cart) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Cart product not found'
                ]);
            }
            $cart->delete();
            return response()->json([
                'status'  => true,
                'message' => 'Cart deleted successfully',
                'data'    => $cart
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
    }

     public function billGenerate(Request $request)  // bill generate data store
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
}
