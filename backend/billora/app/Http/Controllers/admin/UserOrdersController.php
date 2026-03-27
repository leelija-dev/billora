<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Products;
use App\Models\UserOrderItems;
use App\Models\UserOrders;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function PHPSTORM_META\map;

class UserOrdersController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {

            $data = $request->validate([
                'user_id' => 'required',
                'store_id' => 'required',
                'customer_name' => 'nullable',
                'customer_phone' => 'required',

                'product_id'   => 'required|array',
                'product_id.*' => 'exists:products,id',

                'quantity'     => 'required|array',
                'quantity.*'   => 'integer|min:1',

                'unit_id'      => 'required|array',
            ]);

            //  Prevent duplicate order_id
            $lastOrderId = UserOrders::where('user_id', $data['user_id'])
                ->lockForUpdate()
                ->max('order_id');

            $nextId = $lastOrderId ? (int)$lastOrderId + 1 : 1;
            $order_id = str_pad($nextId, 3, '0', STR_PAD_LEFT);

            //  Fetch all products once
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

            $orders = UserOrders::create([
                'user_id'        => $data['user_id'],
                'order_id'       => $order_id,
                'store_id'       => $data['store_id'],
                'total_items'    => count($data['product_id']),
                'total_amount'   => $total_amount,
                'paid_amount'    => 0,
                'payment_status' => 'pending',
                'payment_method' => 'cash',
                'order_status'   => 'pending',
                'customer_name'  => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'],
                'order_by'       => 'user',
                'created_by'     => $data['user_id'],
            ]);
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
                    'id'           => $item->id,
                    'product_id'   => $product_id,
                    'product_name' => $product->name, 
                    'quantity'     => $data['quantity'][$key],
                    'price'        => $product->selling_price,
                    'gst'          => $product->gst_percentage,
                    'discount'     => $product->discount_percentage,
                ];
            }

            DB::commit();
            // $orderHistory = UserOrders::where('user_id', $data['user_id'])->where
            return response()->json([
                'status' => true,
                'message' => 'Order placed successfully',
                'user_name' => $data['customer_name'],
                'user_phone' => $data['customer_phone'],
                'data' => $orders,
                'items' =>$orderItems
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }


    public function userOrderHistory($id){
        try{
        $user = Auth::user()->id;
        if($user != $id){
            return response()->json([
                'status'=>false,
                'message'=>'Unauthorized user'
            ]);
        }
        $orderHistory = UserOrders::with(['items.product'])
            ->where('user_id', $id)
            ->get();
        return response()->json([
            'status' => true,
            'message' => 'Order History',
            'data' => $orderHistory 
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
