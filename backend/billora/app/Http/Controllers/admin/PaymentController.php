<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\PaymentHistory;
use App\Models\PlanPurchaseHistory;
use App\Models\Plans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'plan_id' => 'required|exists:plans,id',
            'customer_id' => 'required|exists:customers,id',
        ]);
        $customer = Customers::find($request->customer_id);
        $orderId = 'order_' . uniqid();
        $url = config('cashfree.base_url') . '/orders';

        $response = Http::withHeaders([
            'x-client-id' => config('cashfree.app_id'),
            'x-client-secret' => config('cashfree.secret_key'),
            'x-api-version' => '2022-09-01',
            'Content-Type' => 'application/json'
        ])->post($url, [
            "order_id" => $orderId,
            "order_amount" => $request->amount,
            "order_currency" => "INR",
            "customer_details" => [
                "customer_id" => $request->customer_id,
                "customer_email" => $customer->email,
                "customer_phone" => $customer->phone
            ],
            "order_meta" => [
                "return_url" => url('/payment-success?order_id={order_id}')
            ]
        ]);

        $data = $response->json();

        // Handle API failure
        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cashfree API failed',
                'error' => $data
            ]);
        }

        // Store Payment (PENDING)
        PaymentHistory::create([
            'customer_id' => $request->customer_id,
            'plan_id' => $request->plan_id,
            'amount' => $request->amount,
            'payment_method' => 'cashfree',
            'transaction_id' => $orderId,
            'status' => 'PENDING'
        ]);

        // Store Plan (temporary state)
        PlanPurchaseHistory::create([
            'user_id' => $request->customer_id,
            'plan_id' => $request->plan_id,
            'price' => $request->amount,
            'currency' => 'INR',
            'start_date' => null,
            'end_date' => null,
            'status' => 'cancelled', // placeholder
            'payment_id' => $orderId,
            'payment_status' => 'pending',
            'payment_method' => 'cashfree'
        ]);
         $sessionId = $data['payment_session_id'];
         // Remove any extra "paymentpayment" suffix if present
        if (str_ends_with($sessionId, 'paymentpayment')) {
            $sessionId = str_replace('paymentpayment', '', $sessionId);
        }
          $encodedSessionId = urlencode($sessionId);
        // Create correct payment URL
        $paymentUrl = "https://sandbox.cashfree.com/pg/checkout?session_id=" . $encodedSessionId;
        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
            'payment_url' => $paymentUrl,
            'data' => $data
        ]);
    }

    // VERIFY PAYMENT
    public function verifyPayment($order_id)
    {
        $url = config('cashfree.base_url') . '/orders/' . $order_id;

        $response = Http::withHeaders([
            'x-client-id' => config('cashfree.app_id'),
            'x-client-secret' => config('cashfree.secret_key'),
            'x-api-version' => '2022-09-01',
        ])->get($url);

        $data = $response->json();

        // API failure handling
        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cashfree verify API failed',
                'error' => $data
            ]);
        }

        $payment = PaymentHistory::where('transaction_id', $order_id)->first();
        $planPurchase = PlanPurchaseHistory::where('payment_id', $order_id)->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ]);
        }

        // Prevent duplicate processing
        if ($planPurchase && $planPurchase->payment_status === 'success') {
            return response()->json([
                'success' => true,
                'message' => 'Already processed'
            ]);
        }

        $orderStatus = $data['order_status'] ?? '';

        // PAYMENT SUCCESS
        if ($orderStatus === 'PAID') {

            $payment->update([
                'status' => 'SUCCESS'
            ]);

            if ($planPurchase) {
                $plan = Plans::find($planPurchase->plan_id);

                $planPurchase->update([
                    'status' => 'active',
                    'payment_status' => 'success',
                    'start_date' => Carbon::now(),
                    'end_date' => Carbon::now()->addDays($plan->duration ?? 30)
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment successful',
                'data' => $data
            ]);
        }

        //  PAYMENT STILL PENDING
        if ($orderStatus === 'ACTIVE') {

            $payment->update([
                'status' => 'PENDING'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment still pending',
                'data' => $data
            ]);
        }

        // PAYMENT FAILED / EXPIRED
        $payment->update([
            'status' => 'FAILED'
        ]);

        if ($planPurchase) {
            $planPurchase->update([
                'status' => 'cancelled',
                'payment_status' => 'failed'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment failed',
            'data' => $data
        ]);
    }
}
