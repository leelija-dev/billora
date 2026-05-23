<?php

namespace App\Jobs;

use App\Models\Customers;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
class CustomerRegistrationJob implements ShouldQueue
{
    use Dispatchable, Queueable;
    public $customerId;
    public $token;


    /**
     * Create a new job instance.
     */
    public function __construct($customerId, $token)
    {
        $this->customerId = $customerId;
        $this->token = $token;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $customer = Customers::find($this->customerId);
        if (!$customer) {
            return;
        }
        $id = Crypt::encryptString($customer->id);
            $qrUrl = env('FRONTEND_ADMIN_URL', 'https://thefastbill.com') . '/products/' . $id;
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
            // Log::info("Customer QR code generated and uploaded for customer ID: {$customer->id}");
            //Mail send 
            $controller = app(
            \App\Http\Controllers\admin\CustomerController::class
            );

        $customerMail =
            $controller->CustomerMail(
                $customer->id,
                $this->token
            );
        
        $adminMail =
            $controller->adminMail(
                $customer->id
            );
         $admin_mail_id = config('app.admin_mail');
         Mail::html($adminMail, function ($message) use ($admin_mail_id) {
                    $message->to($admin_mail_id)
                        ->subject("New User Registered");
                });
        // Log::info("Customer admin mail sent: {$admin_mail_id}");
        Mail::html($customerMail, function ($message) use ($customer) {
                    $message->to($customer->email)
                        ->subject('Welcome! Please Verify Your Email');
                });
        // Log::info("Customer mail sent: {$customer->email}");
    }
}
