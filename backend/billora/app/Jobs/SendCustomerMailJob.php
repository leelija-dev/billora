<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\Customers;
use App\Models\AdminMailHistory;
use App\Http\Controllers\admin\superadmin\CustomerController;
class SendCustomerMailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public $customer;
    public $subject;
    public $message;
    public function __construct($customer, $subject, $message)
    {
        $this->customer = $customer;
        $this->subject = $subject;
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
         // Create history entry first
        $history = AdminMailHistory::create([
            'customer_id' => $this->customer->id,
            'email' => $this->customer->email,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => 'pending',
        ]);

        try {

            $mailContent = app()->make(CustomerController::class)
                ->Mail($this->customer->id, $this->subject, $this->message);

            Mail::html($mailContent, function ($mail) {
                $mail->to($this->customer->email)
                     ->subject($this->subject);
            });

            // Update success
            $history->update([
                'status' => 'sent'
            ]);

        } catch (\Exception $e) {

            Log::error("Mail failed for Customer ID {$this->customer->id}", [
                'error' => $e->getMessage()
            ]);

            //  Update failed
            $history->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    
    }
}
