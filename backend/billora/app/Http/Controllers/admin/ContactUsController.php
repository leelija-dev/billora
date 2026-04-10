<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
class ContactUsController extends Controller
{
    public function index(){
        
    }
    public function store(Request $request)
    {
        try{
        $data = $request->validate([
           'name' => 'required',
           'email' => 'required|email',
           'phone' => 'required',
           'subject' => 'required',
           'message' => 'required',
        ]);
        $contact = ContactUs::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message
        ]);
        if($contact){
        $admin_mail_id = config('app.admin_mail');
        $customerMail = $this->customerMail($data['name'], $data['email'], $data['phone'], $data['subject'], $data['message']);
        $adminMail = $this->adminMail($data['name'], $data['email'], $data['phone'], $data['subject'], $data['message']);
        $subject = "Message Confirmation";
        Mail::html($customerMail, function ($message) use ($data,$subject) {
                $message->to($data['email'])
                ->subject($subject);
        });
        Mail::html($adminMail, function ($message) use ($data, $admin_mail_id) {
            $message->to($admin_mail_id)
                    ->subject($data['subject']);
        });
        }
        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully'
        ]);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }


    }
    public function adminMail($name, $email, $phone, $subject, $message){
      $html ="<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
    <title>Admin Contact Us Email Template | Name, Subject, Message & Mobile</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #eef2f8;
            font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 48px 24px;
            line-height: 1.5;
        }

        /* Main container */
        .template-wrapper {
            max-width: 680px;
            margin: 0 auto;
        }

        /* Card style for preview */
        .preview-card {
            background: #ffffff;
            border-radius: 32px;
            box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            transition: all 0.2s ease;
        }

        .card-header {
            padding: 24px 30px 16px 30px;
            border-bottom: 2px solid #f0f2f6;
            background: #ffffff;
        }

        .card-header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: -0.3px;
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 6px;
        }

        .badge-admin {
            background: #fff3e3;
            color: #b45309;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 5px 14px;
            border-radius: 40px;
            letter-spacing: normal;
        }

        .card-sub {
            color: #5b6e8c;
            font-size: 0.85rem;
            margin-top: 6px;
        }

        /* Email preview area */
        .email-preview {
            padding: 30px;
            background: #fbfdff;
        }

        /* Actual email template styles (inline-ready, but visually rich) */
        .admin-email-container {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background-color: #ffffff;
            border-radius: 28px;
            border: 1px solid #e9edf2;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
        }

        /* Gradient header */
        .email-header {
            background: linear-gradient(105deg, #0f2b3d 0%, #1e4a6e 100%);
            padding: 32px 30px;
            color: white;
        }

        .email-header h2 {
            font-size: 1.8rem;
            font-weight: 700;
            margin: 0 0 8px;
            letter-spacing: -0.3px;
        }

        .email-header p {
            font-size: 0.9rem;
            opacity: 0.85;
            margin: 0;
        }

        .email-body {
            padding: 32px 30px;
            background: #ffffff;
        }

        /* Contact details card */
        .contact-details-card {
            background: #f8fafc;
            border-radius: 24px;
            padding: 20px 24px;
            margin: 20px 0 24px;
            border: 1px solid #eef2f8;
        }

        .detail-row {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            width: 110px;
            font-weight: 700;
            color: #1e293b;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .detail-value {
            flex: 1;
            color: #0f172a;
            font-size: 1rem;
            font-weight: 500;
            word-break: break-word;
        }

        .detail-value a {
            color: #1e4a6e;
            text-decoration: none;
            font-weight: 500;
        }

        .detail-value a:hover {
            text-decoration: underline;
        }

        /* Message box */
        .message-box {
            background: #fefce8;
            border-left: 6px solid #eab308;
            padding: 20px 24px;
            border-radius: 20px;
            margin: 18px 0 20px;
            color: #1e293b;
        }

        .message-box strong {
            display: block;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #b45309;
            margin-bottom: 12px;
        }

        .message-content {
            font-size: 1rem;
            line-height: 1.5;
            white-space: pre-wrap;
            font-family: inherit;
        }

        /* Action buttons */
        .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            margin: 28px 0 16px;
        }

        .btn-primary {
            background: #0f3b5c;
            color: white;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: 0.2s;
            border: none;
            cursor: pointer;
        }

        .btn-secondary {
            background: transparent;
            border: 1.5px solid #cbd5e1;
            color: #1e293b;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: 0.2s;
        }

        .btn-primary:hover, .btn-secondary:hover {
            transform: translateY(-1px);
        }

        /* Footer */
        .footer-note {
            font-size: 0.7rem;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
            margin-top: 32px;
            padding-top: 20px;
            text-align: center;
        }

        /* Info alert for dynamic vars */
        .var-info {
            background: #f1f5f9;
            padding: 12px 20px;
            border-radius: 20px;
            margin-top: 16px;
            font-size: 0.7rem;
            color: #334155;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        .var-info code {
            background: #e2e8f0;
            padding: 3px 8px;
            border-radius: 20px;
            font-family: monospace;
            font-size: 0.7rem;
            color: #0f172a;
        }

        hr {
            margin: 12px 0;
            border: 0;
            height: 1px;
            background: #e2e8f0;
        }

        @media (max-width: 580px) {
            .email-preview {
                padding: 20px;
            }
            .email-body {
                padding: 24px 20px;
            }
            .detail-label {
                width: 100%;
                margin-bottom: 6px;
            }
            .card-header h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
<div class='template-wrapper'>
    
        
        <div class='email-preview'>
            <!-- ========== ADMIN EMAIL TEMPLATE (Name, Email, Subject, Message, Mobile) ========== -->
            <div class='admin-email-container'>
    
    <!-- Header -->
    <div class='email-header'>
        <h2>New Contact Form Submission</h2>
        <p>You have received a new inquiry from your website</p>
    </div>

    <!-- Body -->
    <div class='email-body'>

        <p style='margin-bottom: 10px;'>Hello <strong>Admin</strong>,</p>

        <p style='margin-bottom: 20px; color:#475569;'>
            A new message has been submitted via the <strong>Contact Us</strong> form.
            Please review the details below.
        </p>

        <!-- Contact Details -->
        <div class='contact-details-card'>

            <div class='detail-row'>
                <div class='detail-label'>Name</div>
                <div class='detail-value'>{$name}</div>
            </div>

            <div class='detail-row'>
                <div class='detail-label'>Email</div>
                <div class='detail-value'>
                    <a href='mailto:{$email}'>{$email}</a>
                </div>
            </div>

            <div class='detail-row'>
                <div class='detail-label'>Mobile</div>
                <div class='detail-value'>{$phone}</div>
            </div>

            <div class='detail-row'>
                <div class='detail-label'>Subject</div>
                <div class='detail-value'>
                    <strong>{$subject}</strong>
                </div>
            </div>

        </div>

        <!-- Message -->
        <div class='message-box'>
            <strong>Message</strong>
            <div class='message-content'>
                {$message}
            </div>
        </div>

        <!-- Buttons -->
        <div class='action-buttons'>
            <a href='mailto:{$email}?subject=Re%3A%20{$subject}' class='btn-primary'>
                Reply to Customer
            </a>

            <a href='#' class='btn-secondary'>
                View in Dashboard
            </a>
        </div>

        <!-- Footer -->
        <div class='footer-note'>
            This is an automated notification from <strong>{config('app.name')}</strong>.<br>
            Please do not reply directly to this email.
        </div>

    </div>
</div>
    </div>
    
   
</div>
</body>
</html>";  
return $html;
    }
    public function customerMail($name, $email, $phone, $subject, $message){
        $html = "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes'>
    <title>Professional Email Template | Contact Form Confirmation for User</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #e9eef3;
            font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 48px 24px;
            line-height: 1.5;
        }

        /* Container */
        .template-container {
            max-width: 680px;
            margin: 0 auto;
        }

        /* Card preview */
        .preview-card {
            background: #ffffff;
            border-radius: 36px;
            box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.18);
            overflow: hidden;
            transition: transform 0.2s;
        }

        .card-header {
            padding: 28px 32px 16px 32px;
            border-bottom: 1px solid #edf2f7;
            background: #ffffff;
        }

        .card-header h1 {
            font-size: 1.9rem;
            font-weight: 700;
            letter-spacing: -0.4px;
            background: linear-gradient(135deg, #1A2A3A, #2C4A6E);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            display: inline-block;
        }

        .badge-pro {
            background: #e6f7ec;
            color: #1e7b48;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 40px;
            margin-left: 12px;
            vertical-align: middle;
        }

        .card-sub {
            color: #5b6e8c;
            font-size: 0.85rem;
            margin-top: 8px;
        }

        /* Email preview */
        .email-preview {
            padding: 32px;
            background: #ffffff;
        }

        /* ========== PROFESSIONAL USER EMAIL TEMPLATE ========== */
        .pro-email {
            font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            border-radius: 28px;
            border: 1px solid #eef2f9;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
        }

        /* Header with brand touch */
        .email-header-pro {
            background: linear-gradient(120deg, #0F2C3D 0%, #1A4A6F 100%);
            padding: 36px 32px;
            text-align: left;
            position: relative;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
        }

        .brand-icon {
            background: rgba(255,255,255,0.15);
            width: 44px;
            height: 44px;
            border-radius: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
        }

        .brand-text {
            font-weight: 700;
            font-size: 1.2rem;
            letter-spacing: -0.2px;
            color: white;
        }

        .email-header-pro h2 {
            font-size: 1.9rem;
            font-weight: 700;
            margin: 0 0 10px;
            color: white;
            letter-spacing: -0.5px;
        }

        .email-header-pro p {
            font-size: 0.95rem;
            opacity: 0.85;
            color: #e2edf7;
            margin: 0;
        }

        /* Body content */
        .email-body-pro {
            padding: 36px 32px 32px;
            background: #ffffff;
        }

        .greeting-box {
            margin-bottom: 24px;
        }

        .greeting-box h3 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #1A2A3A;
            margin-bottom: 6px;
        }

        .greeting-box p {
            color: #3a546d;
            line-height: 1.5;
        }

        /* Elegant card for details */
        .detail-card {
            background: #F9FCFE;
            border-radius: 24px;
            border: 1px solid #E6EDF4;
            padding: 8px 0;
            margin: 24px 0 28px;
            overflow: hidden;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 16px 24px 8px 24px;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #2C6E9E;
            border-bottom: 1px solid #EFF3F8;
        }

        .info-item {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            padding: 14px 24px;
            border-bottom: 1px solid #EFF3F8;
        }

        .info-item:last-child {
            border-bottom: none;
        }

        .info-label {
            width: 110px;
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.85rem;
        }

        .info-value {
            flex: 1;
            color: #1e2f3e;
            font-weight: 500;
            font-size: 0.95rem;
            word-break: break-word;
        }

        .message-block {
            background: #FEFBF0;
            border-left: 5px solid #E6B12E;
            margin: 8px 20px 20px 20px;
            padding: 18px 20px;
            border-radius: 18px;
        }

        .message-label {
            font-weight: 700;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #b87c00;
            margin-bottom: 10px;
            display: block;
        }

        .message-text {
            font-size: 0.95rem;
            line-height: 1.5;
            white-space: pre-wrap;
            color: #2c3e44;
        }

        /* Next steps / CTA section */
        .next-steps-pro {
            background: linear-gradient(135deg, #F1F9FE 0%, #FFFFFF 100%);
            border-radius: 24px;
            padding: 24px 28px;
            margin: 28px 0 24px;
            text-align: center;
            border: 1px solid #E0EEF9;
        }

        .next-steps-pro h4 {
            font-size: 1.2rem;
            font-weight: 700;
            color: #1A4A6F;
            margin-bottom: 10px;
        }

        .button-group-pro {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
            margin: 20px 0 8px;
        }

        .btn-primary-pro {
            background: #1A4A6F;
            color: white;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 60px;
            font-weight: 600;
            font-size: 0.85rem;
            transition: 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .btn-outline-pro {
            background: transparent;
            border: 1.5px solid #C9DDEB;
            color: #1A4A6F;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 60px;
            font-weight: 600;
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        /* Support widget */
        .support-widget {
            background: #F7F9FC;
            border-radius: 20px;
            padding: 18px 22px;
            margin: 18px 0 12px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        .support-text {
            font-weight: 500;
            font-size: 0.85rem;
            color: #2C4A6E;
        }

        .support-link {
            color: #1A4A6F;
            font-weight: 700;
            text-decoration: none;
        }

        .footer-pro {
            border-top: 1px solid #EAF0F6;
            margin-top: 32px;
            padding-top: 24px;
            text-align: center;
            font-size: 0.7rem;
            color: #6c86a3;
        }

        /* Variables info */
        .var-info {
            background: #F1F5F9;
            padding: 12px 20px;
            border-radius: 20px;
            margin-top: 24px;
            font-size: 0.7rem;
            color: #2c3e50;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        .var-info code {
            background: #E4E9F0;
            padding: 3px 8px;
            border-radius: 20px;
            font-family: monospace;
            font-size: 0.7rem;
        }

        hr {
            margin: 8px 0;
        }

        @media (max-width: 600px) {
            .email-preview {
                padding: 20px;
            }
            .email-body-pro {
                padding: 24px 20px;
            }
            .info-label {
                width: 100%;
                margin-bottom: 4px;
            }
            .support-widget {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
            .card-header h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
<div class='template-container'>
    <div class='preview-card'>
      
        <div class='email-preview'>
            <!-- PROFESSIONAL USER TEMPLATE: Contact form submission confirmation -->
            <div class='pro-email'>
                <div class='email-header-pro'>
                   
                    <h2>We received your message</h2>
                    
                </div>
                <div class='email-body-pro'>
                    <div class='greeting-box'>
                        <h3>Hello {$name},</h3>
                        <p>Thank you for reaching out to us. Your request has been successfully delivered to our support team. We truly appreciate you taking the time to contact us.</p>
                    </div>

                    <!-- Detailed info card -->
                    <div class='detail-card'>
                        <div class='section-title'>
                            <span>📋</span> SUBMISSION DETAILS
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Full name</div>
                            <div class='info-value'>{$name}</div>
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Email address</div>
                            <div class='info-value'><a href='mailto:{$email}' style='color:#1A4A6F; text-decoration:none;'>{$email}</a></div>
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Mobile number</div>
                            <div class='info-value'>{$phone}</div>
                        </div>
                        <div class='info-item'>
                            <div class='info-label'>Subject</div>
                            <div class='info-value'><strong>{$subject}</strong></div>
                        </div>
                        <div class='message-block'>
                            <span class='message-label'>✉️ Message</span>
                            <div class='message-text'>{$message}</div>
                        </div>
                    </div>
                    <div class='footer-pro'>
                        <p>This is an automated confirmation mail.<br>
                        © " . date('Y') . " " . config('app.name') . " all rights reserved.<br>
                        </p>
                    </div>
                </div>
            </div>

            
        </div>
    </div>

    </div>
</div>
</body>
</html>";
return $html;
    }
}
