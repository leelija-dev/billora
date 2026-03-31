<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan Expiration Reminder</title>
    <style>
        /* Reset styles for email clients */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7fb;
            margin: 0;
            padding: 0;
        }
        /* Main container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .header .warning-badge {
            background-color: rgba(255, 255, 255, 0.2);
            display: inline-block;
            padding: 6px 16px;
            border-radius: 40px;
            font-size: 14px;
            color: #fff;
            margin-top: 12px;
        }
        /* Content */
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 18px;
            color: #1a2c3e;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .greeting strong {
            color: #667eea;
        }
        .message {
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 28px;
        }
        /* Alert Box */
        .alert-box {
            background-color: #fff5e6;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 28px;
        }
        .alert-box p {
            color: #b45309;
            font-weight: 500;
            margin: 0;
        }
        /* Plan Details Card */
        .plan-card {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 28px;
            border: 1px solid #e2e8f0;
        }
        .plan-card h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .plan-detail {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .plan-detail:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #475569;
        }
        .detail-value {
            color: #1e293b;
            font-weight: 500;
        }
        .expiry-date {
            color: #dc2626;
            font-weight: 700;
        }
        /* Feature Lists */
        .features-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 28px;
        }
        .feature-col {
            flex: 1;
            min-width: 200px;
        }
        .feature-title {
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            font-size: 16px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
        }
        .feature-list li {
            padding: 6px 0;
            color: #4b5563;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .feature-list .cross {
            color: #ef4444;
            font-weight: bold;
        }
        .feature-list .check {
            color: #10b981;
            font-weight: bold;
        }
        /* CTA Button */
        .btn-container {
            text-align: center;
            margin: 28px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        }
        /* Support Section */
        .support-box {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 20px;
            margin-top: 28px;
            text-align: center;
        }
        .support-box p {
            color: #475569;
            margin-bottom: 12px;
        }
        .support-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        /* Footer */
        .footer {
            background-color: #f8fafc;
            padding: 24px 28px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #94a3b8;
            font-size: 12px;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        /* Responsive */
        @media (max-width: 600px) {
            .content {
                padding: 24px 20px;
            }
            .features-grid {
                flex-direction: column;
                gap: 20px;
            }
            .feature-col {
                min-width: auto;
            }
            .btn {
                display: block;
                text-align: center;
            }
            .plan-detail {
                flex-direction: column;
                gap: 4px;
            }
        }
    </style>
</head>
<body style="background-color: #f4f7fb; padding: 24px 16px;">

    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>⚠️ Plan Expiring Soon</h1>
            <div class="warning-badge">
                Action Required
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi <strong>{{$user->name ?? ''}}</strong>,
            </div>
            
            <div class="message">
                We hope you're enjoying your experience with <strong>{{config('app.name')}}</strong>. This is a friendly reminder 
                that your <strong>{{ucfirst($plan->name ?? '')}}</strong> plan is set to expire soon. To avoid any interruption in service, 
                we recommend renewing today.
            </div>

            <!-- Alert Box -->
            <div class="alert-box">
                <p>🔔 <strong>Expires on:  {{$expireDate ? \Carbon\Carbon::parse($expireDate)->format('d-m-Y h:i A') : '00-00-0000'}}</strong> — Only {{$daysLeft ?? 0}} days left!</p>
            </div>

            <!-- Plan Details -->
            <div class="plan-card">
                <h3>📋 Plan Summary</h3>
                <div class="plan-detail">
                    <span class="detail-label">Plan Name:</span>
                    <span class="detail-value"> {{ucfirst($plan->name ?? '')}}</span>
                </div>
                <div class="plan-detail">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value expiry-date"> {{$plan->duration_days ?? 0}} Days</span>
                </div>
                <div class="plan-detail">
                    <span class="detail-label">Expiration Date:</span>
                    <span class="detail-value expiry-date">  {{$expireDate ? \Carbon\Carbon::parse($expireDate)->format('d-m-Y h:i A') : '00-00-0000'}}</span>
                </div>
                
            </div>

           
            <!-- Support Section -->
            <div class="support-box">
                <p>💬 <strong>Need help or have questions?</strong></p>
                <p>Our support team is here for you. Reply to this email or reach out at <br>
                <a href="{{config('app.admin_mail')}}" class="support-link">{{config('app.admin_mail')}}</a></p>
                <p style="font-size: 13px; margin-top: 10px;">📞 {{config('app.admin_mobile')}}</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>{{config('app.name')}}</strong> — Empowering your journey</p>
            
            
            <p>© {{date('Y')}} {{config('app.name')}}. All rights reserved.</p>
        </div>
    </div>

</body>
</html>