<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\Products;
use App\Models\UserOrderItems;
use App\Models\UserOrders;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Monolog\Handler\SyslogUdp\UdpSocket;
use Illuminate\Support\Facades\Http;
use function PHPSTORM_META\map;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
class UserOrdersController extends Controller
{
    public function store(Request $request)   // store order and order items
   {
    DB::beginTransaction();

    try {

        $data = $request->validate([
            // 'user_id' => 'required',
            'store_id' => 'required',
            'customer_name' => 'nullable',
            'customer_phone' => 'required',

            'product_id'   => 'required|array',
            'product_id.*' => 'exists:products,id',

            'quantity'     => 'required|array',
            'quantity.*'   => 'integer|min:1',

            'unit_id'      => 'required|array',
            'payment_mode' => 'required',
        ]);
        $data['user_id'] = Crypt::decryptString($request->user_id);
        // Generate order_id
        $lastOrderId = UserOrders::where('user_id', $data['user_id'])
            ->lockForUpdate()
            ->max('order_id');

        $nextId = $lastOrderId ? (int)$lastOrderId + 1 : 1;
        $order_id = str_pad($nextId, 3, '0', STR_PAD_LEFT);

        // Fetch products
        $products = Products::where('user_id', $data['user_id'])
            ->whereIn('id', $data['product_id'])
            ->get()
            ->keyBy('id');

        $total_amount = 0;

        foreach ($data['product_id'] as $key => $product_id) {

            $product = $products[$product_id] ?? null;
            if (!$product) continue;

            $qty = $data['quantity'][$key];

            $subtotal = $product->selling_price * $qty;
            $discount = ($subtotal * $product->discount_percentage) / 100;
            $afterDiscount = $subtotal - $discount;
            $gst = ($afterDiscount * $product->gst_percentage) / 100;

            $total_amount += ($afterDiscount + $gst);
        }

        $total_amount = round($total_amount, 2);

        $payment_method = null;
        $payment_status = null;
        $paid_amount = 0;

        // =========================
        // CASH PAYMENT
        // =========================
        if ($data['payment_mode'] == 'cash') {

            $payment_status = 'pending';
            $payment_method = 'cash';
        }

        // =========================
        // ONLINE PAYMENT (CASHFREE)
        // =========================
        elseif ($data['payment_mode'] == 'online') {

            $payment_status = 'pending';
            $payment_method = 'online';

            // Create Cashfree Order
            $cf_order_id = 'cf_' . time() . rand(1000,9999);

            $response = Http::withHeaders([
                'x-client-id' => config('cashfree.app_id'),
                'x-client-secret' => config('cashfree.secret_key'),
                'x-api-version' => '2022-09-01',
                'Content-Type' => 'application/json'
            ])->post(config('cashfree.base_url') . '/orders', [
                "order_id" => $cf_order_id,
                "order_amount" => $total_amount,
                "order_currency" => "INR",
                "customer_details" => [
                    "customer_id" => (string)$data['user_id'],
                    "customer_name" => $data['customer_name'] ?? 'Customer',
                    "customer_phone" => $data['customer_phone'],
                ]
            ]);

            if ($response->failed()) {
                DB::rollback();
                return response()->json([
                    'status' => false,
                    'message' => 'Cashfree Error',
                    'error' => $response->json()
                ]);
            }

            $cf = $response->json();
        }

        // =========================
        // CREATE ORDER
        // =========================
        $orders = UserOrders::create([
            'user_id'        => $data['user_id'],
            'order_id'       => $order_id,
            'store_id'       => $data['store_id'],
            'total_items'    => count($data['product_id']),
            'total_amount'   => $total_amount,
            'paid_amount'    => $paid_amount,
            'payment_status' => $payment_status,
            'payment_method' => $payment_method,
            'order_status'   => 'pending',
            'customer_name'  => $data['customer_name'] ?? null,
            'customer_phone' => $data['customer_phone'],
            'order_by'       => 'user',
            'created_by'     => $data['user_id'],
        ]);

        // =========================
        // ORDER ITEMS
        // =========================
        $orderItems = [];

        foreach ($data['product_id'] as $key => $product_id) {

            $product = $products[$product_id] ?? null;
            if (!$product) continue;

            $item = UserOrderItems::create([
                'user_id'           => $data['user_id'],
                'customer_order_id' => $orders->id,
                'order_id'          => $orders->order_id,
                'product_id'        => $product_id,
                'quantity'          => $data['quantity'][$key],
                'unit_id'           => $data['unit_id'][$key],
                'price'             => $product->selling_price,
                'gst'               => $product->gst_percentage,
                'discount'          => $product->discount_percentage,
                'status'            => 'pending',
                'created_by'        => $data['user_id'],
            ]);

            $orderItems[] = [
                'id' => $item->id,
                'product_name' => $product->name,
                'quantity' => $data['quantity'][$key],
                'price' => $product->selling_price,
            ];
        }

        DB::commit();

        // =========================
        // RESPONSE
        // =========================

        // If ONLINE → send session id
        if ($data['payment_mode'] == 'online') {
            return response()->json([
                'status' => true,
                'payment_mode' => 'online',
                'payment_session_id' => $cf['payment_session_id'],
                'message' => 'Redirect to payment'
            ]);
        }

        //  CASH
        return response()->json([
            'status' => true,
            'message' => 'Order placed successfully',
            'data' => $orders,
            'items' => $orderItems
        ]);

    } catch (\Exception $e) {

        DB::rollback();

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}


    public function userOrderHistory($id ,Request $request){      //all user order history
        try{
        $startTime = microtime(true);
        $search = $request->search;
        $user = Auth::user()->id;
        $cacheKey = "user_orders_" . Auth::user()->id . "_" . md5($request->search . '_' . $request->page);
            
           
        if($user != $id){
            return response()->json([
                'status'=>false,
                'user_id'=>$user,
                'message'=>'Unauthorized user'
            ]);
        }
         $formCache = Cache::tags(['order_user_' . Auth::user()->id])->has($cacheKey);
             $tag = "order_user_{$user}";
        $orderHistory = Cache::tags([$tag])->remember($cacheKey, 600, function () use ($id, $search) {
        return UserOrders::with(['items.product'])
            ->where('user_id', $id)->orderBy('id','desc')
            ->when($search, function ($query) use ($search) {

                    $query->where(function ($q) use ($search) {

                        // Search by order id
                        if (is_numeric($search)) {
                            $q->orWhere('id', $search);
                        }

                        // Search by order number
                        $q->orWhere('order_id', 'like', "%{$search}%")
                            ->orWhere('payment_status', 'like', "%{$search}%")
                            ->orWhere('customer_name', 'like', "%{$search}%")
                            ->orWhere('customer_phone', 'like', "%{$search}%")
                            ->orWhere('order_status', 'like', "%{$search}%")
                            ->orWhere('payment_method', 'like', "%{$search}%")
                            ->orWhere('total_amount', 'like', "%{$search}%")
                            ->orwhere('paid_amount', 'like', "%{$search}%")

                            // Search by product name
                            ->orWhereHas('items.product', function ($q2) use ($search) {

                                $q2->where('name', 'like', "%{$search}%");
                            });
                    });
                })
        
            ->get();
        });
        return response()->json([
            'status' => true,
            'message' => 'Order History',
            'response_from' => $formCache ? 'Cache' : 'Database',
            'response_time' => microtime(true) - $startTime,
            'data' => $orderHistory 
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
    
            ]);
        }
    }
    public function updateOrderStatus(Request $request, $id){    //update order status
        try{
            $user = Auth::user()->id;
            $data = $request->validate([
                'order_status' => 'required'
            ]);
            $order = UserOrders::where('user_id', $user)->where('id', $id)->first();
            $order_items = UserOrderItems::where('user_id', $user)->where('customer_order_id', $order->id)->get();
            $order->update($data);
            foreach($order_items as $item){
                $item->update([
                    'status' => $data['order_status']
                ]);
            }
            Cache::tags(['order_user_' . Auth::user()->id])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Order status updated successfully',
                'data' => $order
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function updatePaymentStatus(Request $request, $id){    // update payment status
        try{
            $user = Auth::user()->id;
            $data = $request->validate([
                'payment_status' => 'required'
            ]);
            $order = UserOrders::where('user_id', $user)->where('id', $id)->first();
            $order->update($data);
            Cache::tags(['order_user_' . Auth::user()->id])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Payment status updated successfully',
                'data' => $order
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function userOrderDue( Request $request,$id){     //show single order and due
        try{
            $data=$request->validate([
               'user_id' => 'required', 
            ]);
            $user = Auth::user()->id;
            if($user != $data['user_id']){
                return response()->json([
                    'status' =>true,
                    'message' =>"Unauthorized user"
                ]);
            }
            $order = UserOrders::where('id', $id)->where('user_id',$data['user_id'])->first();
            if(!$order){
                return response()->json([
                    'status' => false,
                    'message' => 'Order not found'
                ]);
            }
            Cache::tags(['order_user_' . Auth::user()->id])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Order due',
                'data' => $order
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function updateOrderPayment(Request $request, $id){     // update order payment
        try{
            $data = $request->validate([
                'user_id' => 'required',
                'paid_amount' => 'required'
            ]);
            
            $order = UserOrders::where('user_id', $data['user_id'])->where('id', $id)->first();
            if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found'
            ], 404);
        }
            $status ="pending";
            if($order->total_amount == ((float)$order->paid_amount + (float)$data['paid_amount'])){
                $status = "completed";
            }
            if($order->paid_amount >= $order->total_amount){
                return response()->json([
                    'status'=> true,
                    'message' => 'Payment already completed'
                ]);
            }elseif($data['paid_amount'] > $order->total_amount){
                return response()->json([
                    'status'=> true,
                    'message' => 'paid amount can not be greater than total amount'
                ]);
            }elseif($data['paid_amount'] < 0){
                return response()->json([
                    'status'=> true,
                    'message' => 'paid amount can not be negative'
                ]);
            }
            $order->update([
                'paid_amount'=> (float)$order->paid_amount + $data['paid_amount'],
                'payment_status' => $status
            ]);
            Cache::tags(['order_user_' . Auth::user()->id])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Payment updated successfully',
                'data' => $order
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function userOrderDetails(Request $request,$mobile){
        try{
            $user_id = Crypt::decryptString($request->user_id);
            $user = Customers::find($user_id);
            if(!$user){
                return response()->json([
                    'status' => false,
                    'message' => 'User not found'
                ]);
            }
            $orders = UserOrders::where('user_id', $user_id)->where('customer_phone',$mobile)->with('items.product','store')->orderBy('id','desc')->get();
            
            return response()->json([
                'status' => true,
                'message' => 'User Order details',  // single user order details
                'data' => $orders
            ]);

        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
