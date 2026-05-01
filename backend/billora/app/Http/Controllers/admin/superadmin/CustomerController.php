<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use App\Models\PlanPurchaseHistory;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendCustomerMailJob;
use Illuminate\Support\Str;
class CustomerController extends Controller
{
  public function index(Request $request)
  {
    $query = Customers::query();

    // Search logic
    if ($request->filled('search')) {
      $search = $request->search;

      $query->where(function ($q) use ($search) {

        $searchValue = strtolower($search);

        // status search
        if ($searchValue === 'active' || $searchValue === '1' || $searchValue === 'act') {
          $q->where('is_active', 1);
        } elseif ($searchValue === 'inactive' || $searchValue === '0' || $searchValue === 'inact') {
          $q->where('is_active', 0);
        } else {
          $q->where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%")
            ->orWhere('phone', 'like', "%$search%");
        }
      });
    }elseif($request->filled('status')) {
      $status = strtolower($request->status);
      if ( $status === '1' ) {
        $query->where('is_active', 1);
      } elseif ($status === '0') {
        $query->where('is_active', 0);
      }
    }

    $customers = $query->paginate(10)->withQueryString();

    return view('admin.customers.index', compact('customers'));
  }
  public function plans($id)
  {
    $customer = Customers::find($id);
    $plans = PlanPurchaseHistory::with('plan')->where('user_id', $id)->orderBy('id', 'desc')->paginate(10)->withQueryString();
    return view('admin.customers.customer_plan', compact('customer', 'plans', 'id'));
  }
  public function customerMail(Request $request)
  {
    if ($request->has('all') && $request->all == 'true') {

      $query = Customers::query();

      if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {

          $searchValue = strtolower($search);

          if ($searchValue === 'active' || $searchValue === '1' || $searchValue === 'act') {
            $q->where('is_active', 1);
          } elseif ($searchValue === 'inactive' || $searchValue === '0' || $searchValue === 'inact') {
            $q->where('is_active', 0);
          } else {
            $q->where('name', 'like', "%$search%")
              ->orWhere('email', 'like', "%$search%")
              ->orWhere('phone', 'like', "%$search%");
          }
        });
      }elseif($request->filled('status')) {
      $status = strtolower($request->status);
      if ( $status === '1' ) {
        $query->where('is_active', 1);
      } elseif ($status === '0') {
        $query->where('is_active', 0);
      }
    }

      $customers = $query->get();
      $customer_ids = $customers->pluck('id')->toArray();
    } else {

      if (!$request->ids) {
        return redirect()->back()->with('error', 'No customers selected');
      }

      $customer_ids = explode(',', $request->ids);
      $customers = Customers::whereIn('id', $customer_ids)->get();
    }

    return view('admin.customers.send_mail', compact('customer_ids', 'customers'));
  }

  public function sendMail(Request $request)
  {
    $data = $request->validate([
      'customer_ids' => 'required|array',
      'customer_ids.*' => 'exists:customers,id',
      'subject' => 'required|string',
      'message' => 'required|string',
    ]);

    $customers = Customers::whereIn('id', $data['customer_ids'])->get();

    foreach ($customers as $customer) {

      if (!$customer->email) {
        Log::warning("Customer ID {$customer->id} has no email. Skipped.");
        continue;
      }

      //  Dispatch to queue
      SendCustomerMailJob::dispatch($customer, $data['subject'], $data['message']);
    }

    return back()->with('success', 'Mail queued successfully!');
  }
  public function Mail($id, $subject, $message)
  {
    $customer = Customers::find($id);
    $html = "<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Announcement Email</title>
  <style>
    /* Basic reset for email clients */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  </style>
</head>
<body style='margin: 0; padding: 0; background-color: #e9ecef; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;'>
  
  <!-- Main Email Container -->
  <table width='100%' cellpadding='0' cellspacing='0' border='0' align='center' bgcolor='#e9ecef' style='background-color: #e9ecef;'>
    <tr>
      <td align='center' style='padding: 40px 20px;'>
        
        <!-- Inner Content Table (max-width: 600px) -->
        <table width='100%' max-width='600' cellpadding='0' cellspacing='0' border='0' align='center' style='max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;'>
          
          <!-- Header / Hero Section -->
          <tr>
            <td bgcolor='#1e3a5f' style='background-color: #1e3a5f; padding: 40px 30px; text-align: center;'>
              <h1 style='color: #ffffff; font-size: 26px; font-weight: 600; margin: 0 0 8px 0;'>" . config('app.name') . "</h1>
              
            </td>
          </tr>
          
          <!-- Greeting / Body -->
          <tr>
            <td style='padding: 32px 30px 20px 30px; background-color: #ffffff;'>
              <p style='font-size: 16px; color: #2d3748; line-height: 1.5; margin-bottom: 20px;'>Dear <strong>" . $customer->name . "</strong>,</p>
              <p style='font-size: 16px; color: #2d3748; line-height: 1.5; margin-bottom: 20px;'>" . $message . "</p>
                      
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style='padding: 0 30px;'>
              <hr style='border: 0; height: 1px; background-color: #e2e8f0; margin: 8px 0;'>
            </td>
          </tr>
          
          <!-- Footer / Unsubscribe -->
          <tr>
            <td style='padding: 24px 30px 32px 30px; background-color: #ffffff;'>
              
              <p style='font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;'>
                &copy;  " . date('Y') . " " . config('app.name') . ". All rights reserved.<br>
                
              </p>
            </td>
          </tr>
          
        </table>
        <!-- End Inner Table -->
               
      </td>
    </tr>
  </table>
  <!-- End Main Container -->
  
</body>
</html>";

    return $html;
  }
public function sendVerificationMail($customer_id)
{
    $customer = Customers::findOrFail($customer_id);

    // Generate token if not exists
    if (!$customer->verification_token) {
        $customer->verification_token = Str::random(64);
        $customer->save();
    }

    $subject = "Verify Your Email Address";

    // Your HTML template
    $html = $this->VerifyMail($customer->id, $customer->verification_token);

    // Send mail
    Mail::send([], [], function ($message) use ($customer, $subject, $html) {

        $message->to($customer->email, $customer->name)
                ->subject($subject)
                ->html($html);
    });

    return redirect()->route('admin.customers.index')->with('success', 'Verification mail sent successfully.');
}
  public function verifyEmail($token)
    {
        $customer = Customers::where('verification_token', $token)->first();

        if (!$customer) {
            return "Invalid or expired token";
        }

        $customer->update([
            'email_verified_at' => now(),
            'verification_token' => null
        ]);
        
        $frontendLoginUrl = env('REACT_APP_URL', 'http://localhost:4000');
        return redirect($frontendLoginUrl . '/login?verified=true');
    }
 // customer verify mail
  public function VerifyMail($customer_id,$token){
    $customer = Customers::findOrFail($customer_id);
    $verifyUrl = url('/verify-email/' . $token);

    $html = "
    <!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Welcome to YourApp!</title>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1a202c;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        padding: 20px;
    }
    
    .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    /* Header */
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 48px 32px;
        text-align: center;
    }
    
    .welcome-icon {
        font-size: 64px;
        margin-bottom: 16px;
    }
    
    .header h1 {
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin: 0;
        letter-spacing: -0.5px;
    }
    
    /* Content */
    .content {
        padding: 40px;
    }
    
    .greeting {
        font-size: 24px;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 16px;
    }
    
    .message {
        color: #4a5568;
        margin-bottom: 24px;
        font-size: 16px;
        line-height: 1.6;
    }
    
    /* Password Box */
    .password-box {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-radius: 16px;
        padding: 20px;
        margin: 24px 0;
        text-align: center;
        border: 1px solid #fbbf24;
    }
    
    .password-label {
        font-size: 12px;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .password-value {
        font-size: 28px;
        font-weight: 800;
        font-family: 'Courier New', monospace;
        color: #d97706;
        background: white;
        display: inline-block;
        padding: 8px 24px;
        border-radius: 12px;
        margin: 12px 0;
        letter-spacing: 2px;
    }
    
    .password-note {
        font-size: 12px;
        color: #92400e;
        margin-top: 8px;
    }
    
    /* Info Grid */
    .info-grid {
        background: #f7fafc;
        border-radius: 16px;
        padding: 24px;
        margin: 24px 0;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .info-item:last-child {
        border-bottom: none;
    }
    
    .info-label {
        font-weight: 600;
        color: #4a5568;
    }
    
    .info-value {
        color: #2d3748;
    }
    
    /* Buttons */
    .action-buttons {
        margin: 32px 0;
    }
    
    .btn {
        display: inline-block;
        padding: 14px 32px;
        text-align: center;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        margin-right: 12px;
        margin-bottom: 12px;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
    }
    
    .btn-secondary {
        background: #edf2f7;
        color: #4a5568;
    }
    
    /* Feature List */
    .feature-list {
        margin: 24px 0;
        padding: 0;
        list-style: none;
    }
    
    .feature-list li {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .feature-icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        flex-shrink: 0;
    }
    
    /* Support Box */
    .support-box {
        background: #f7fafc;
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        margin: 24px 0;
    }
    
    .support-email {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
    }
    
    /* Footer */
    .footer {
        background: #f7fafc;
        padding: 24px;
        text-align: center;
        font-size: 12px;
        color: #718096;
        border-top: 1px solid #e2e8f0;
    }
    
    .footer a {
        color: #667eea;
        text-decoration: none;
        margin: 0 8px;
    }
    
    /* Responsive */
    @media (max-width: 600px) {
        body {
            padding: 10px;
        }
        
        .content {
            padding: 24px;
        }
        
        .btn {
            display: block;
            margin-right: 0;
        }
        
        .info-item {
            flex-direction: column;
        }
        
        .info-value {
            margin-top: 4px;
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
        <!-- Header -->
        <div class='header'>
            <div class='welcome-icon'>🎉</div>
            <h1>Welcome to ".config('app.name')."</h1>
        </div>

        <!-- Content -->
        <div class='content'>
            <div class='greeting'>Hello!</div>
            
                <div class='message'>
            Your account has been successfully created. 
                Please verify your email before logging in.
            </div>

            <div class='action-buttons'>
                <a href='".$verifyUrl."' class='btn btn-primary'>Verify Your Email</a>
            </div>


            <!-- Password Box (Optional - only if password is provided) 
            <div class='password-box'>
                <div class='password-label'>🔑 Your Temporary Password</div>
                <div class='password-value'>Temp@123456</div>
                <div class='password-note'>Please change this password after your first login for security reasons.</div>
            </div> -->

            <!-- Customer Information -->
            <div class='info-grid'>
                <div class='info-item'>
                    <span class='info-label'>Email Address: </span>
                    <span class='info-value'>".($customer->email)."</span>
                </div>
                <div class='info-item'>
                    <span class='info-label'>Registration Date: </span>
                    <span class='info-value'> ".($customer->created_at->format('d-m-Y h:i A'))."</span>
                </div>
                <div class='info-item'>
                    <span class='info-label'>Account Status: </span>
                    <span class='info-value'> Please verify your account before logging in.</span>
                </div>
            </div>

            <!-- Action Buttons 
            <div class='action-buttons'>
                <a href='#' class='btn btn-primary'>🔐 Login to Your Account</a>
                <a href='#' class='btn btn-secondary'>📊 Go to Dashboard</a>
            </div> -->

            <!-- Feature List -->
            <div style='margin: 24px 0;'>
                <div style='font-weight: 700; margin-bottom: 12px; color: #2d3748;'> What you can do next:</div>
                <ul class='feature-list'>
                    <li>
                        <span class='feature-icon'> </span>
                        <span> Verify your account before logging in.</span>
                    </li>
                    <li>
                        <span class='feature-icon'> </span>
                        <span> Set up your profile.</span>
                    </li>
                    <li>
                        <span class='feature-icon'> </span>
                        <span> Explore our plans and choose the best fit for you</span>
                    </li>
                   
                </ul>
            </div>

            <!-- Support Box -->
            <div class='support-box'>
                <strong>❓ Need Help?</strong><br>
                Our support team is here to assist you!<br>
                Contact us at <a href='mailto:".config('app.admin_mail')."' class='support-email'>".config('app.admin_mail')."</a>
            </div>
        </div>

        <!-- Footer -->
        <div class='footer'>
            <p>© ".date('Y')." ".config('app.name').". All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    return $html;  
}
}
