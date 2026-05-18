<?php



namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customers;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CustomerController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        return response()->json([
            'status' => true,
            'message' => 'User List',
            'data' => $user
        ]);
    }

    // public function store(Request $request)
    // {
    //     try {
    //         $data = $request->validate([
    //             'name'          => 'nullable|string',
    //             'email'         => 'required|email|unique:customers,email',
    //             'phone'         => 'nullable',
    //             'password'      => 'required|min:6',
    //             'company_name'  => 'nullable',
    //             'gst_number'    => 'nullable',
    //             'address'       => 'nullable',
    //             'city'          => 'nullable',
    //             'state'         => 'nullable',
    //             'country'       => 'nullable',
    //             'pincode'       => 'nullable',
    //             'created_by'    => 'nullable'
    //         ]);

    //         $data['verification_token'] = Str::random(64);
    //         $data['password'] = Hash::make($data['password']);
    //         $customer = Customers::create($data);

    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User Registered Successfully',
    //             'data' => $customer
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ], 422);
    //     }
    // }
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name'          => 'nullable|string',
                'email'         => 'required|email|unique:customers,email',
                'phone'         => 'nullable',
                'password'      => 'required',
                'company_name'  => 'nullable',
                'gst_number'    => 'nullable',
                'address'       => 'nullable',
                'city'          => 'nullable',
                'state'         => 'nullable',
                'country'       => 'nullable',
                'pincode'       => 'nullable',
                'created_by'    => 'nullable'
            ]);
            $data['verification_token'] = Str::random(64);
            $data['password'] = Hash::make($data['password']);
            $customer = Customers::create($data);
            $qrUrl = env('FRONTEND_ADMIN_URL', 'https://thefastbill.com') . '/products/id=' . $customer->id;

            $renderer = new ImageRenderer(
                new RendererStyle(200),
                new SvgImageBackEnd()
            );

            $writer = new Writer($renderer);
            $tempFile = sys_get_temp_dir() . '/qr_' . $customer->id . '.svg';

            $writer->writeFile($qrUrl, $tempFile);
           $upload = Cloudinary::uploadApi()->upload(
            $tempFile,
                [
                    'folder' => 'Thefastbill/customer_products',
                    'public_id' => 'customer_qr_' . $customer->id,
                    'overwrite' => true,
                    'resource_type' => 'image'
                ]
            );
            if (file_exists($tempFile)) {
                unlink($tempFile);
            }
            $customer->update([
                'products_qr' => $upload['secure_url'],
                'products_qr_public_id' => $upload['public_id']
            ]);
           
            Log::info('QR Generated Successfully');

            // $customer->notify(new VerifyEmailNotification($data['verification_token']));
            try {
                $customerMail = $this->CustomerMail($customer->id, $data['verification_token']);
                $adminMail = $this->AdminMail($customer->id);
                $admin_mail_id = config('app.admin_mail');
                // Send admin mail
                Mail::html($adminMail, function ($message) use ($admin_mail_id) {
                    $message->to($admin_mail_id)
                        ->subject("New User Registered");
                });
                //customer mail

                Mail::html($customerMail, function ($message) use ($customer) {
                    $message->to($customer->email)
                        ->subject('Welcome! Please Verify Your Email');
                });
            } catch (\Exception $e) {
                // Log the error or handle it as needed
                Log::error('Mail sending failed', [
                    'error' => $e->getMessage(),
                    'user_id' => $customer->id
                ]);
            }
            return response()->json([
                'status' => true,
                'message' => 'User Register Successfully.Plase check your email for verification link.',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function edit($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $id != $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ], 403);
            }

            $customer = Customers::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'User Details',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user || $id != $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized user'
            ], 403);
        }

        try {
            $data = $request->validate([
                'name'          => 'nullable|string',
                'phone'         => 'nullable',
                'company_name'  => 'nullable',
                'gst_number'    => 'nullable',
                'address'       => 'nullable',
                'city'          => 'nullable',
                'state'         => 'nullable',
                'country'       => 'nullable',
                'pincode'       => 'nullable',
            ]);

            $customer = Customers::findOrFail($id);
            $customer->update($data);

            return response()->json([
                'status' => true,
                'message' => 'User Updated Successfully',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function updatePassword($id, Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $id != $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user'
                ], 403);
            }

            $request->validate([
                'current_password' => 'required',
                'new_password'     => 'required|min:6',
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = Customers::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect credentials. Please try again.'
            ], 401);
        }

        if (is_null($user->email_verified_at)) {
            return response()->json([
                'status' => false,
                'message' => 'Please verify your email before login'
            ], 401);
        }
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Incorrect credentials. Please try again.'
            ], 401);
        }

        // Delete existing tokens
        // $user->tokens()->delete();

        // Create new token for backward compatibility
        $token = $user->createToken('auth-token')->plainTextToken;

        // Use Laravel's built-in session authentication
        // This will create the 'thefastbill-session' cookie automatically
        Auth::login($user);

        // Get cookie domain from env
        $cookieDomain = env('AUTH_COOKIE_DOMAIN', null);
        $cookieSecure = env('AUTH_COOKIE_SECURE', false);
        $cookieSameSite = env('AUTH_COOKIE_SAMESITE', 'none');

        // Prepare response with token in body
        $response = response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);

        // Set HTTP-only auth_token cookie for backward compatibility
        if ($cookieDomain) {
            $response->cookie(
                'auth_token',
                $token,
                60 * 24 * 30, // 30 days
                '/',
                $cookieDomain,
                $cookieSecure,
                true, // HttpOnly
                false,
                $cookieSameSite
            );
        }

        return $response;
    }

  
    public function logout(Request $request)
    {
        // Delete sanctum tokens
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        // Logout web guard
        Auth::guard('web')->logout();

        // Destroy session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Create response
        $response = response()->json([
            'status' => true,
            'message' => 'Logout successful'
        ]);

        // Remove session cookie
        $response->withCookie(
            cookie()->forget(config('session.cookie'))
        );

        // Remove auth token cookie
        $response->withCookie(
            cookie()->forget('auth_token')
        );

        return $response;
    }

    public function checkSession(Request $request)
    {
        // Use Laravel's built-in session authentication
        // This will automatically check the 'thefastbill-session' cookie
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        return response()->json([
            'status' => true,
            'message' => 'Authenticated',
            'user' => $user
        ]);
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

        $frontendLoginUrl = env('FRONTEND_LOGIN_URL', 'https://thefastbill.com');
        return redirect($frontendLoginUrl . '/login');
    }

    public function resendVerificationEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:customers,email'
            ]);

            $customer = Customers::where('email', $request->email)->first();

            // Check if email is already verified
            if (!is_null($customer->email_verified_at)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email is already verified'
                ], 400);
            }

            // Generate new verification token
            $newToken = Str::random(64);
            $customer->update([
                'verification_token' => $newToken
            ]);

            // Send verification email
            try {
                $customerMail = $this->CustomerMail($customer->id, $newToken);

                Mail::html($customerMail, function ($message) use ($customer) {
                    $message->to($customer->email)
                        ->subject('Verify Your Email Address');
                });

                Log::info('Verification email resent successfully', [
                    'customer_id' => $customer->id,
                    'email' => $customer->email
                ]);

                return response()->json([
                    'status' => true,
                    'message' => 'Verification email sent successfully. Please check your inbox.'
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to resend verification email', [
                    'error' => $e->getMessage(),
                    'customer_id' => $customer->id,
                    'email' => $customer->email
                ]);

                return response()->json([
                    'status' => false,
                    'message' => 'Failed to send verification email. Please try again later.'
                ], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Resend verification email error', [
                'error' => $e->getMessage(),
                'email' => $request->email ?? null
            ]);

            return response()->json([
                'status' => false,
                'message' => 'An error occurred. Please try again later.'
            ], 500);
        }
    }
    public function forgotPassword(Request $request)
{
    try {

        $request->validate([
            'email' => 'required|email'
        ]);

        $customer = Customers::where(
            'email',
            $request->email
        )->first();

        if (!$customer) {

            return response()->json([
                'status' => false,
                'message' => 'Email not found'
            ]);
        }

        // Generate token
        $token = Str::random(64);

        // Save token
        $customer->update([
            'reset_password_token' => $token,
            'reset_password_expire_at' => now()->addMinutes(10)
        ]);

        // Frontend URL
        $resetUrl =
            env('FRONTEND_ADMIN_URL') .
            "/reset-password?token=" . $token;
        $app_name = config('app.name');
        $app_url = env('FRONTEND_LOGIN_URL');
        // Mail HTML
        $html = "
            
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Reset Your Password</title>
            </head>

            <body style='margin:0;padding:0;background:#eef2f7;font-family:Helvetica,Arial,sans-serif;'>

                <table width='100%' cellpadding='0' cellspacing='0' style='padding:50px 15px;'>
                    <tr>
                        <td align='center'>

                            <!-- Main Card -->
                            <table width='620' cellpadding='0' cellspacing='0'
                                style='background:#ffffff;
                                        border-radius:18px;
                                        overflow:hidden;
                                        box-shadow:0 8px 30px rgba(0,0,0,0.08);'>

                                <!-- Top Banner -->
                                <tr>
                                    <td style='background:linear-gradient(135deg,#4f46e5,#2563eb);
                                            padding:45px 40px;
                                            text-align:center;'>

                                        <div style='background:rgba(255,255,255,0.15);
                                                    width:80px;
                                                    height:80px;
                                                    line-height:80px;
                                                    border-radius:50%;
                                                    margin:auto;
                                                    font-size:38px;
                                                    color:#ffffff;'>

                                            🔒

                                        </div>

                                        <h1 style='margin:20px 0 10px;
                                                color:#ffffff;
                                                font-size:30px;
                                                font-weight:700;'>

                                            Reset Password

                                        </h1>

                                        <p style='margin:0;
                                                color:rgba(255,255,255,0.85);
                                                font-size:15px;'>

                                            Secure access to your account

                                        </p>

                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style='padding:45px 40px;color:#1f2937;'>

                                        <p style='margin-top:0;
                                                font-size:17px;
                                                font-weight:600;'>

                                            Hi {$customer->name},

                                        </p>

                                        <p style='font-size:15px;
                                                line-height:1.8;
                                                color:#4b5563;'>

                                            We received a request to reset the password
                                            for your account. To continue, click the button below.

                                        </p>

                                        <!-- Button -->
                                        <div style='text-align:center;margin:40px 0;'>

                                            <a href='{$resetUrl}'
                                            style='display:inline-block;
                                                    background:#2563eb;
                                                    color:#ffffff;
                                                    padding:16px 38px;
                                                    border-radius:50px;
                                                    text-decoration:none;
                                                    font-size:16px;
                                                    font-weight:bold;
                                                    letter-spacing:0.3px;
                                                    box-shadow:0 4px 14px rgba(37,99,235,0.35);'>

                                                Reset Password

                                            </a>

                                        </div>

                                        <!-- Info Box -->
                                        <div style='background:#f9fafb;
                                                    border-left:4px solid #2563eb;
                                                    padding:18px 20px;
                                                    border-radius:8px;'>

                                            <p style='margin:0;
                                                    font-size:14px;
                                                    line-height:1.7;
                                                    color:#4b5563;'>

                                                ⏳ This reset link is valid for only
                                                <strong>10 minutes</strong>.
                                            
                                            </p>

                                        </div>

                                        <!-- Divider -->
                                        <div style='margin:35px 0;
                                                    border-top:1px solid #e5e7eb;'></div>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td align='center'
                                        style='background:#f9fafb;
                                            padding:25px;
                                            font-size:12px;
                                            color:#9ca3af;'>

                                        © ".date('Y')." <a href='{$app_url}' style='color:#2563eb;'>{$app_name}</a> all rights reserved.
                                       
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>

                    ";

        // Send mail
        Mail::html($html, function ($message) use ($customer) {

            $message->to($customer->email)
                ->subject('Reset Password');
        });

        return response()->json([
            'status' => true,
            'message' => 'Reset password link sent to email'
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
public function resetPassword(Request $request)
{
    try {

        $request->validate([
            'token' => 'required',
            'password' => 'required|confirmed'
        ]);

        $customer = Customers::where(
            'reset_password_token',
            $request->token
        )->first();

        if (!$customer) {

            return response()->json([
                'status' => false,
                'message' => 'Invalid token'
            ]);
        }

        // Expire check
        if (
            now()->gt($customer->reset_password_expire_at)
        ) {

            return response()->json([
                'status' => false,
                'message' => 'Token expired'
            ]);
        }

        // Update password
        $customer->update([

            'password' => Hash::make(
                $request->password
            ),

            'reset_password_token' => null,
            'reset_password_expire_at' => null

        ]);

        return response()->json([
            'status' => true,
            'message' => 'Password reset successfully'
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}

    // namespace App\Http\Controllers\admin;

    // use App\Http\Controllers\Controller;
    // use Illuminate\Http\Request;
    // use App\Models\Customers;
    // use Illuminate\Support\Facades\Hash;
    // use Illuminate\Support\Facades\Auth;
    // use Illuminate\Support\Str;
    // use App\Notifications\VerifyEmailNotification;
    // use Illuminate\Support\Facades\Mail;
    // use Illuminate\Support\Facades\Log;
    // class CustomerController extends Controller
    // {


    //     public function index() // check logged in user
    //     {
    //         // $customer = Customers::id()->get();
    //         $customer = Auth::user();
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User List',
    //             'data' => $customer
    //         ]);
    //     }
    //     public function store(Request $request)
    //     {
    //         try{
    //         $data = $request->validate([
    //             'name'          => 'nullable|string',
    //             'email'         => 'required|email',
    //             'phone'         => 'nullable',
    //             'password'      => 'required',
    //             'company_name'  => 'nullable',
    //             'gst_number'    => 'nullable',
    //             'address'       => 'nullable',
    //             'city'          => 'nullable',
    //             'state'         => 'nullable',
    //             'country'       => 'nullable',
    //             'pincode'       => 'nullable',
    //             'created_by'    => 'nullable'

    //         ]);
    //          $data['verification_token'] = Str::random(64);
    //         $data['password'] = Hash::make($data['password']);
    //         $customer = Customers::create($data);
    //         // $customer->notify(new VerifyEmailNotification($data['verification_token']));
    //     try{
    //        $customerMail = $this->CustomerMail($customer->id, $data['verification_token']);
    //         $adminMail = $this->AdminMail($customer->id);
    //         $admin_mail_id = config('app.admin_mail');
    //         // Send admin mail
    //         Mail::html($adminMail, function ($message) use ($admin_mail_id) {
    //             $message->to($admin_mail_id)
    //                     ->subject("New User Registered");
    //         });
    //         //customer mail

    //         Mail::html($customerMail, function ($message) use ($customer) {
    //             $message->to($customer->email)
    //                     ->subject('Welcome! Please Verify Your Email');
    //         });
    //     }catch (\Exception $e) {
    //         // Log the error or handle it as needed
    //         Log::error('Mail sending failed', [
    //                 'error' => $e->getMessage(),
    //                 'user_id' => $customer->id
    //             ]);

    //         }
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User Register Successfully',
    //             'data' => $customer
    //         ]);
    //     }catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }

    //     }
    // //    public function login(Request $request) //web based 
    // // {
    // //     $request->validate([
    // //         'email' => 'required|email',
    // //         'password' => 'required'
    // //     ]);

    // //     $user = Customers::where('email', $request->email)->first();

    // //     if (!$user || !Hash::check($request->password, $user->password)) {
    // //         return response()->json([
    // //             'status' => false,
    // //             'message' => 'Invalid credentials'
    // //         ]);
    // //     }

    // //     Auth::login($user); // create session

    // //     return response()->json([
    // //         'status' => true,
    // //         'message' => 'Login successful',
    // //         'user' => $user
    // //     ]);
    // // }
    // public function edit($id){
    //     try{
    //         if (!Auth::check()) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'User not authenticated',
    //                 'id'=>$id,

    //             ]);
    //         }
    //         $user = Auth::user()->id;
    //         if($id != $user){
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Unauthorized user'
    //             ]);
    //         }
    //         $customer = Customers::findOrFail($id);
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User Details',
    //             'data' => $customer
    //         ]);
    //     }catch(\Exception $e){
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }
    // public function update(Request $request, $id){
    //     $user = Auth::user()->id;
    //     if($id != $user){
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Unauthorized user'
    //         ]);
    //     }
    //     try{
    //         $data = $request->validate([
    //             'name'          => 'nullable|string',
    //             // 'email'         => 'required|email',
    //             'phone'         => 'nullable',
    //             'company_name'  => 'nullable',
    //             'gst_number'    => 'nullable',
    //             'address'       => 'nullable',
    //             'city'          => 'nullable',
    //             'state'         => 'nullable',
    //             'country'       => 'nullable',
    //             'pincode'       => 'nullable',
    //             // 'created_by'    => 'nullable'

    //         ]);
    //         $customer = Customers::findOrFail($id);
    //         if(!$customer){
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'User not found'
    //             ]);
    //         }
    //         $customer->update($data);
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User Updated Successfully',
    //             'data' => $customer
    //         ]);
    //     }catch(\Exception $e){
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }
    // public function updatePassword($id,Request $request)   // update password
    // {
    //     try {
    //         // Check Auth
    //         if (!Auth::check()) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'User not authenticated'
    //             ], 401);
    //         }
    //         if($id != Auth::user()->id){
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Unauthorized user'
    //             ]);
    //         }

    //         // Validate input
    //         $request->validate([
    //             'current_password' => 'required',
    //             'new_password'     => 'required',
    //         ]);

    //         $user = Auth::user();

    //         // Check current password
    //         if (!Hash::check($request->current_password, $user->password)) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Current password is incorrect'
    //             ]);
    //         }

    //         // Update password
    //         $user->password = Hash::make($request->new_password);
    //         $user->save();

    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Password updated successfully'
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ]);
    //     }
    // }
    // public function login(Request $request)  //postman
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required'
    //     ]);

    //     $user = Customers::where('email', $request->email)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'User not found'
    //         ]);
    //     }
    // // Block login if not verified
    // if (is_null($user->email_verified_at)) {
    //     return response()->json([
    //         'status' => false,
    //         'message' => 'Please verify your email before login'
    //     ]);
    // }
    //     if (!Hash::check($request->password, $user->password)) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Invalid password'
    //         ]);
    //     }

    //     $token = $user->createToken('customer-token')->plainTextToken;

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Login successful',
    //         'token' => $token,
    //         'user' => $user
    //     ]);
    // }
    // public function logout(Request $request)
    // {
    //     $user = $request->user();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'User not authenticated'
    //         ], 401);
    //     }

    //     $user->currentAccessToken()->delete();

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Logout successful'
    //     ]);
    // }
    // public function verifyEmail($token)
    // {
    //     $customer = Customers::where('verification_token', $token)->first();

    //     if (!$customer) {
    //         return "Invalid or expired token";
    //     }

    //     $customer->update([
    //         'email_verified_at' => now(),
    //         'verification_token' => null
    //     ]);

    //     return redirect(env('FRONTEND_LOGIN_URL') . '/login')->with('message', 'Email verified successfully. You can now log in.');
    // }

    public function CustomerMail($customer_id, $token)
    {
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
            <h1>Welcome to " . config('app.name') . "</h1>
        </div>

        <!-- Content -->
        <div class='content'>
            <div class='greeting'>Hello!</div>
            
                <div class='message'>
            Your account has been successfully created. 
                Please verify your email before logging in.
            </div>

            <div class='action-buttons'>
                <a href='" . $verifyUrl . "' class='btn btn-primary'>Verify Your Email</a>
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
                    <span class='info-value'>" . ($customer->email) . "</span>
                </div>
                <div class='info-item'>
                    <span class='info-label'>Registration Date: </span>
                    <span class='info-value'> " . ($customer->created_at->format('d-m-Y h:i A')) . "</span>
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
                Contact us at <a href='mailto:" . config('app.admin_mail') . "' class='support-email'>" . config('app.admin_mail') . "</a>
            </div>
        </div>

        <!-- Footer -->
        <div class='footer'>
            <p>© " . date('Y') . " " . config('app.name') . ". All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        return $html;
    }

    public function adminMail($customer_id)
    {
        $customer = Customers::findOrFail($customer_id);
        $html = "
    <!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>New Customer Registration - " . config('app.name') . "</title>
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
        max-width: 650px;
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
    
    .header h1 {
        font-size: 28px;
        font-weight: 700;
        color: white;
        margin: 0;
    }
    
    .badge {
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
    
    /* Content */
    .content {
        padding: 40px;
    }
    
    /* Alert */
    .alert {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-left: 4px solid #f59e0b;
        padding: 20px;
        margin-bottom: 32px;
        border-radius: 12px;
    }
    
    .alert strong {
        color: #d97706;
    }
    
    /* Stats Cards */
    .stats {
        display: flex;
        gap: 20px;
        margin-bottom: 32px;
    }
    
    .stat-card {
        flex: 1;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
    }
    
    .stat-number {
        font-size: 32px;
        font-weight: 800;
        color: #667eea;
        margin-bottom: 8px;
    }
    
    .stat-label {
        font-size: 12px;
        color: #718096;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Customer Card */
    .customer-card {
        background: #f7fafc;
        border-radius: 20px;
        padding: 24px;
        margin: 24px 0;
        border: 2px solid #e2e8f0;
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
        font-size: 24px;
    }
    
    /* Details Grid */
    .details-grid {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 16px;
        margin: 20px 0;
    }
    
    .details-label {
        font-weight: 600;
        color: #4a5568;
    }
    
    .details-value {
        color: #2d3748;
    }
    
    .details-value a {
        color: #667eea;
        text-decoration: none;
    }
    
    /* Buttons */
    .action-buttons {
        display: flex;
        gap: 16px;
        margin: 32px 0;
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
    
    .btn-secondary {
        background: #edf2f7;
        color: #4a5568;
    }
    
    /* Checklist */
    .checklist {
        background: #f0fdf4;
        border-radius: 16px;
        padding: 20px;
        margin: 24px 0;
        border: 1px solid #86efac;
    }
    
    .checklist h4 {
        color: #15803d;
        margin-bottom: 12px;
        font-size: 16px;
    }
    
    .checklist ul {
        margin: 0;
        padding-left: 20px;
    }
    
    .checklist li {
        margin: 8px 0;
        color: #166534;
    }
    
    /* Additional Info */
    .additional-info {
        background: #fef3c7;
        border-radius: 12px;
        padding: 16px;
        margin: 20px 0;
        font-size: 13px;
        color: #92400e;
        text-align: center;
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
    
    .highlight {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
    }
    
    code {
        background: #edf2f7;
        padding: 2px 6px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 12px;
        color: #2d3748;
    }
</style>
</head>
<body>
    <div class='container'>
        <!-- Header -->
        <div class='header'>
            <h1>New Customer Registration</h1>
        </div>

        <!-- Content -->
        <div class='content'>
            <!-- Alert -->
            <div class='alert'>
                <strong>New Customer Alert!</strong> A new customer has just registered on " . config('app.name') . ". 
                Please review their details and take necessary actions.
            </div>

            <!-- Customer Information -->
            <div class='customer-card'>
                <div class='section-title'>
                    <span>👤</span>
                    Customer Information
                </div>
                <div class='details-grid'>
                    
                    <div class='details-label'>Email Address</div>
                    <div class='details-value'>
                        <a href='mailto:" . ($customer->email) . "'>" . ($customer->email) . "</a>
                    </div>

                    
                </div>
            </div>

            <!-- Action Buttons -->
            <div class='action-buttons'>
                <a href=" . route('admin.customers.plans', $customer->id) . " class='btn btn-primary'>View Customer Profile</a>
            </div>

        </div>

        <!-- Footer -->
        <div class='footer'>
            <p><strong>" . config('app.name') . "</strong> </p>
            <p>This is an automated notification sent to the admin team</p>
            
             <p style='font-size: 11px; margin-top: 16px;'>@" . date('Y') . " all rights reserved</p>
        </div>
    </div>
</body>
</html>
    ";
        return $html;
    }
}
