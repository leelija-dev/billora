<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\PaymentHistory;
use App\Models\PlanBusinessType;
use App\Models\PlanPurchaseHistory;
use App\Models\Plans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'plan_id' => 'required|exists:plans,id',
            'business_type_id' => 'required',
            'customer_id' => 'required|exists:customers,id',
            'customer_phone'=>'required',
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
                "customer_phone" => $request->customer_phone
            ],
            "order_meta" => [
                // "return_url" => url('/payment-success?order_id={order_id}'),
                "return_url" => url('/api/cashfree/verify/{order_id}')
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
        $customer->update(['phone' => $request->customer_phone]);

        // Store Plan (temporary state)
        $planPurchase = PlanPurchaseHistory::create([
            'user_id' => $request->customer_id,
            'plan_id' => $request->plan_id,
            'price' => $request->amount,
            'currency' => 'INR',
            'start_date' => null,
            'end_date' => null,
            'status' => 'cancelled', // placeholder
            'payment_id' => $orderId,
            'payment_status' => 'pending',
            'payment_method' => 'cashfree',
            'remarks' => 'new purchase'
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
public function paymentSuccess(Request $request)
{
    $orderId = $request->query('order_id');

    if (!$orderId) {
        return response()->json([
            'success' => false,
            'message' => 'order_id missing'
        ], 422);
    }

    return $this->verifyPayment($orderId);
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

    if ($response->failed()) {
        return response()->json([
            'success' => false,
            'message' => 'Cashfree verify API failed',
            'error' => $data
        ]);
    }

    $payment = PaymentHistory::where('transaction_id', $order_id)->first();
    $planPurchase = PlanPurchaseHistory::where('payment_id', $order_id)->first();

    if (!$payment || !$planPurchase) {
        return response()->json([
            'success' => false,
            'message' => 'Payment or Plan not found'
        ]);
    }

    // Safe fetch
    $customer = Customers::find($planPurchase->user_id);
    $plan = Plans::find($planPurchase->plan_id);
    $bussiness_type = PlanBusinessType::where('plan_id',$plan->id)->first();

    // Prevent duplicate
    if ($planPurchase->payment_status === 'success') {
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

        $planPurchase->update([
            'status' => 'active',
            'payment_status' => 'success',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addDays($plan->duration_days ?? 30)
        ]);
        //customer plan activate
        $customer->update([
            'plan_id' => $plan->id,
            'business_type_id' => $bussiness_type->business_type_id,
            'is_active' => true
        ]);
        // Generate mail
        $adminMail = $this->adminMail(
            $customer->id,
            $planPurchase->id,
            $plan->id,
            $plan->name,
            $planPurchase->price
        );

        $customerMail = $this->customerMail(
            $customer->id,
            $plan->id,
            $planPurchase->id
        );
        $admin_mail_id = config('app.admin_mail');
        // Send admin mail
        Mail::html($adminMail, function ($message) use ($admin_mail_id, $plan) {
            $message->to($admin_mail_id)
                    ->subject("New Plan {$plan->name} Purchase Notification");
        });

        //  Send customer mail
        Mail::html($customerMail, function ($message) use ($customer, $plan) {
            $message->to($customer->email)
                    ->subject("Your plan {$plan->name} is activated!");
        });

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Payment successful',
        //     'data' => $data
        // ]);
        $redirectUrl = rtrim(env('FRONTEND_LOGIN_URL', 'http://localhost:3000'), '/') . '/dashboard';
        return redirect()->away($redirectUrl);
    }

    //  PENDING
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

    //  FAILED
    $payment->update([
        'status' => 'FAILED'
    ]);

    $planPurchase->update([
        'status' => 'cancelled',
        'payment_status' => 'failed'
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Payment failed',
        'data' => $data
    ]);
}

    public function adminMail($customer_id, $order_id, $plan_id, $planName, $amount)
{
    $customer = Customers::find($customer_id);
    $planPurchase = PlanPurchaseHistory::find($order_id);
    $plan = Plans::find($plan_id);

    $html = "
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>New Plan Purchase Notification</title>
<style>
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1a202c;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
.container {
    max-width: 650px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 48px 32px;
    text-align: center;
    position: relative;
}
.header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
}
.header .badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 16px;
    color: white;
}
.content {
    padding: 40px 40px 32px;
}
.alert {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-left: 4px solid #f59e0b;
    padding: 20px;
    margin-bottom: 32px;
    border-radius: 12px;
    color: #92400e;
}
.alert strong {
    color: #d97706;
}
.stats {
    display: flex;
    gap: 20px;
    margin-bottom: 32px;
}
.stat-card {
    flex: 1;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    padding: 24px 16px;
    text-align: center;
    transition: transform 0.2s;
}
.stat-number {
    font-size: 28px;
    font-weight: 800;
    color: #2d3748;
    margin-bottom: 8px;
}
.stat-label {
    font-size: 13px;
    color: #718096;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.customer-info {
    background: #f7fafc;
    border-radius: 20px;
    padding: 24px;
    margin: 32px 0;
    border: 1px solid #e2e8f0;
}
.section-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 8px;
}
.section-title span {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: white;
    font-size: 16px;
}
.details-grid {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 16px;
    margin: 20px 0;
}
.details-label {
    font-weight: 600;
    color: #4a5568;
    font-size: 14px;
}
.details-value {
    color: #2d3748;
    font-weight: 500;
}
.amount-highlight {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.code {
    background: #edf2f7;
    padding: 4px 8px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #2d3748;
}
.action-buttons {
    display: flex;
    gap: 16px;
    margin: 40px 0 32px;
    flex-wrap: wrap;
}
.btn {
    flex: 1;
    padding: 14px 24px;
    text-align: center;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}
.btn-secondary {
    background: #edf2f7;
    color: #4a5568;
}
.btn-secondary:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
}
.notes-section {
    background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
    border-radius: 16px;
    padding: 24px;
    margin: 32px 0;
}
.notes-section strong {
    color: #c53030;
    display: block;
    margin-bottom: 12px;
    font-size: 15px;
}
.notes-section ul {
    margin: 0;
    padding-left: 20px;
}
.notes-section li {
    color: #742a2a;
    margin: 8px 0;
    font-size: 14px;
}
.footer {
    background: #f7fafc;
    padding: 24px 40px;
    text-align: center;
    font-size: 12px;
    color: #718096;
    border-top: 1px solid #e2e8f0;
}
.footer p {
    margin: 8px 0;
}
.footer a {
    color: #667eea;
    text-decoration: none;
    margin: 0 8px;
}
.footer a:hover {
    text-decoration: underline;
}
.divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
    margin: 24px 0;
}
@media (max-width: 600px) {
    .container {
        margin: 20px;
        border-radius: 20px;
    }
    .content {
        padding: 24px;
    }
    .stats {
        flex-direction: column;
    }
    .details-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    .action-buttons {
        flex-direction: column;
    }
    .header {
        padding: 32px 24px;
    }
    .header h1 {
        font-size: 24px;
    }
}
</style>
</head>
<body>
<div class='container'>
    <div class='header'>
        <h1>✨ New Plan Purchase</h1>
        <div class='badge'>⚠️ Requires Review</div>
    </div>

    <div class='content'>
        <div class='alert'>
            <strong>🎯 Action Required:</strong> A customer has just purchased a new plan. Please review the details and take necessary actions.
        </div>

        <div class='stats'>
            <div class='stat-card'>
                <div class='stat-number'>" . number_format($planPurchase->price, 2) . "</div>
                <div class='stat-label'>Total Price</div>
            </div>
            <div class='stat-card'>
                <div class='stat-number'>" . $plan->name . "</div>
                <div class='stat-label'>Plan Type</div>
            </div>
            <div class='stat-card'>
                <div class='stat-number'>" . $planPurchase->created_at->format('d M Y') . "</div>
                <div class='stat-label'>Purchase Date</div>
            </div>
        </div>

        <div class='customer-info'>
            <div class='section-title'>
                <span>👤</span>
                Customer Information
            </div>
            <div class='details-grid'>
                <div class='details-label'>Full Name</div>
                <div class='details-value'><strong>" . ($customer->name ?? 'N/A') . "</strong></div>

                <div class='details-label'>Email Address</div>
                <div class='details-value'>
                    <a href='mailto:" . ($customer->email ?? '') . "' style='color: #667eea; text-decoration: none;'>" . ($customer->email ?? 'N/A') . "</a>
                </div>

                <div class='details-label'>Phone Number</div>
                <div class='details-value'>" . ($customer->phone ?? 'N/A') . "</div>
            </div>
        </div>

        <div>
            <div class='section-title'>
                <span>📋</span>
                Purchase Details
            </div>
            <div class='details-grid'>
                <div class='details-label'>Plan Name</div>
                <div class='details-value'><strong>" . $planName . "</strong></div>

                <div class='details-label'>Amount Paid</div>
                <div class='details-value amount-highlight'>" . number_format($amount, 2) . "</div>

                <div class='details-label'>Plan Duration</div>
                <div class='details-value'>" . ($plan->duration_days ?? 'N/A') . "</div>

                <div class='details-label'>Transaction ID</div>
                <div class='details-value'><span class='code'>" . ($planPurchase->payment_id ?? 'N/A') . "</span></div>

                <div class='details-label'>Payment Method</div>
                <div class='details-value'>" . ucfirst($planPurchase->payment_method ?? 'N/A') . "</div>

                <div class='details-label'>Purchase Date & Time</div>
                <div class='details-value'>" . $planPurchase->created_at->format('d M Y, h:i A') . "</div>

                <div class='details-label'>Invoice Number</div>
                <div class='details-value'><span class='code'>INV-" . $planPurchase->id . "</span></div>
            </div>
        </div>

        <div class='action-buttons'>
            <a href=". route('admin.customers.plans',$customer->id) ." class='btn btn-primary'>View Customer Profile</a>
            <a href=".route('admin.plans.purchase-history')." class='btn btn-primary'>View Transaction Details</a>
            <a href=".route('admin.dashboard')." class='btn btn-secondary'>Go to Dashboard</a>
        </div>

        <div class='notes-section'>
            <strong>📝 Admin Checklist</strong>
            <ul>
                <li>✓ Verify payment status in the payment gateway</li>
                <li>✓ Send welcome email if not automated</li>
                <li>✓ Provision account access if needed</li>
                <li>✓ Update CRM/accounting records</li>
                <li>✓ Schedule onboarding call if applicable</li>
            </ul>
        </div>

        <div class='divider'></div>
    </div>

    <div class='footer'>
        <p><strong>" . config('app.name') . "</strong> Admin System</p>
        <p>This is an automated notification sent to the admin team</p>
        <p>
            <a href='#'>⚙️ Notification Settings</a> • 
            <a href='#'>📈 Sales Report</a> • 
            <a href='#'>🔔 View All Notifications</a>
        </p>
        <p style='font-size: 11px; margin-top: 16px;'>Sent on " . date('F j, Y, g:i a') . "</p>
    </div>
</div>
</body>
</html>
";

    return $html;
}

    public function customerMail($customer_id, $plan_id, $purchase_id)
{
    $customer = Customers::findOrFail($customer_id);
    $plan = Plans::findOrFail($plan_id);
    $planPurchase = PlanPurchaseHistory::find($purchase_id);
    $admin_mail_id = config('app.admin_mail');
    $html = "
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Plan Purchase Confirmation</title>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
.container { max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
.header h1 { margin: 0; font-size: 28px; }
.header p { margin: 10px 0 0; opacity: 0.9; }
.content { padding: 40px 30px; }
.thank-you { font-size: 24px; margin-bottom: 20px; color: #667eea; }
.plan-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
.plan-name { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 10px; }
.plan-price { font-size: 28px; font-weight: bold; color: #667eea; margin: 10px 0; }
.details-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin: 20px 0; }
.details-label { font-weight: bold; color: #555; }
.details-value { color: #333; }
.transaction-id { font-family: monospace; background: #f4f4f4; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
.button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; text-align: center; }
.button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102,126,234,0.4); }
.footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #e0e0e0; }
.footer a { color: #667eea; text-decoration: none; }
@media (max-width: 600px) {
    .container { margin: 10px; }
    .content { padding: 20px; }
    .details-grid { grid-template-columns: 1fr; gap: 5px; }
}
</style>
</head>
<body>
<div class='container'>
    <div class='header'>
        <h1>Thank You for Your Purchase! 🎉</h1>
        <p>Your plan has been successfully activated</p>
    </div>

    <div class='content'>
        <div class='thank-you'>
            Hello " . ($customer->name ?? '') . "!
        </div>

        <p>Thank you for choosing " . config('app.name') . ". We're excited to have you on board! Your plan has been successfully purchased and is now active.</p>

        <div class='plan-details'>
            <div class='plan-name'>" . ($plan->name ?? '') . "</div>
            <div class='plan-price'>₹" . number_format($plan->price, 2) . "</div>
            <div style='margin-top: 10px; color: #666;'>
                Valid : <strong>" . ($plan->duration_days ?? '0') . " days</strong>
            </div>
        </div>

        <div class='details-grid'>
            <div class='details-label'>Transaction ID:</div>
            <div class='details-value transaction-id'>" . ($planPurchase->payment_id ?? '') . "</div>

            <div class='details-label'>Payment Method:</div>
            <div class='details-value'>" . ucfirst($planPurchase->payment_method ?? '') . "</div>

            <div class='details-label'>Purchase Date:</div>
            <div class='details-value'>" . ($planPurchase->created_at ? $planPurchase->created_at->format('d-m-Y h:i A') : '') . "</div>

            <div class='details-label'>Invoice Number:</div>
            <div class='details-value'>" . ($planPurchase->id ?? '') . "</div>
        </div>

       
        <div style='margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;'>
            <strong>📋 What's Next?</strong>
            <ul style='margin-top: 10px; padding-left: 20px;'>
                <li>Access all premium features of your " . ($plan->name ?? '') . " plan</li>
                <li>Check your dashboard for detailed usage statistics</li>
                <li>Contact our support team for any assistance</li>
            </ul>
        </div>
    </div>

    <div class='footer'>
        <p>Need help? Contact us at <a href='mailto:".($admin_mail_id).">".($admin_mail_id)."</a></p>
        <p>&copy; " . date('Y') . " All rights reserved.</p>
        <p>
            <a href='#'>Terms of Service</a> | 
            <a href='#'>Privacy Policy</a>
        </p>
    </div>
</div>
</body>
</html>
";

    return $html;
}

//upgrade plan 
public function upgradePlan(Request $request)
{
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'plan_id' => 'required|exists:plans,id',
            'business_type_id' => 'required',
            'customer_id' => 'required|exists:customers,id',
            'customer_phone'=>'required',
        ]);
        $customer = Customers::find($request->customer_id);
        $lastPlanPurchase = PlanPurchaseHistory::where('user_id', $request->customer_id)->where('plan_id', $customer->plan_id)->latest()->first();
        $orderId = 'order_' . uniqid();
        $url = config('cashfree.base_url') . '/orders';
        $remaningDays = Carbon::parse($lastPlanPurchase->end_date)->diffInDays(Carbon::now(), false);
        $duration = Carbon::parse($lastPlanPurchase->end_date)->diffInDays(Carbon::parse($lastPlanPurchase->start_date));
        $perDayPrice = $lastPlanPurchase->price / (float)$duration;
        $remainingAmount = $perDayPrice * $remaningDays;
        $totalAmount = $request->amount - $remainingAmount;
        $response = Http::withHeaders([
            'x-client-id' => config('cashfree.app_id'),
            'x-client-secret' => config('cashfree.secret_key'),
            'x-api-version' => '2022-09-01',
            'Content-Type' => 'application/json'
        ])->post($url, [
            "order_id" => $orderId,
            "order_amount" => $totalAmount,//$request->amount,
            "order_currency" => "INR",
            "customer_details" => [
                "customer_id" => (string) $request->customer_id,
                "customer_email" => $customer->email,
                "customer_phone" => $request->customer_phone
            ],
            "order_meta" => [
                // "return_url" => url('/payment-success?order_id={order_id}'),
                "return_url" => url('/api/cashfree/verify/{order_id}')
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
            'amount' => $totalAmount,//$request->amount,
            'payment_method' => 'cashfree',
            'transaction_id' => $orderId,
            'status' => 'PENDING'
        ]);
        $customer->update(['phone' => $request->customer_phone]);

        // Store Plan (temporary state)
        $planPurchase = PlanPurchaseHistory::create([
            'user_id' => $request->customer_id,
            'plan_id' => $request->plan_id,
            'price' => $totalAmount,//$request->amount,
            'currency' => 'INR',
            'start_date' => null,
            'end_date' => null,
            'status' => 'cancelled', // placeholder
            'payment_id' => $orderId,
            'payment_status' => 'pending',
            'payment_method' => 'cashfree',
            'remarks' => 'Upgrade Plan'
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
}

