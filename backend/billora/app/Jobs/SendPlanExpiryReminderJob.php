<?php

namespace App\Jobs;

use App\Mail\PlanExpiryReminder;
use App\Models\Customers;
use App\Models\PlanExpireNotification;
use App\Models\PlanPurchaseHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Bus\Dispatchable;

class SendPlanExpiryReminderJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    protected $sendEmail;

    /**
     * Create a new job instance.
     */
    public function __construct($sendEmail = true)
    {
        $this->sendEmail = $sendEmail;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Plan Expiry Job Started');
        $today = Carbon::today();

        //get all active plan
        $plans = PlanPurchaseHistory::with('user', 'plan')
            ->where('status', 'active')
            ->whereDate('end_date', '>=', $today)
            ->get();
       

        Log::info('Plan find for expiry reminder: ' . $plans->count());
        if ($plans->isEmpty()) {
            Log::warning('No active plans found');
        }
        foreach ($plans as $plan) {
            // Calculate days left
            $daysLeft = $today->diffInDays($plan->end_date, false);
            $days_before_reminder = config('app.days_reminder');
            // Check if within 7 days
            $expireDate = $plan->end_date;
            if ($daysLeft <= $days_before_reminder && $daysLeft >= 0) {
                if ($this->sendEmail) {
                    Log::info("Sending mail to: " . $plan->user->email);
                    Mail::to($plan->user->email)
                        ->queue(new PlanExpiryReminder(
                            $plan->user,
                            $plan->plan,
                            $daysLeft,
                            $expireDate
                        ));
                }
                // Create JSON notification for frontend
                $notificationData = [
                    'plan_name' => $plan->plan->name,
                    'days_left' => $daysLeft,
                    'expire_date' => $plan->end_date->format('Y-m-d'),
                    'message' => "Your plan '{$plan->plan->name}' will expire in {$daysLeft} days."
                ];
                // Avoid duplicate notifications for same user per day
                $exists = PlanExpireNotification::where('user_id', $plan->user->id)
                    ->whereDate('created_at', $today)
                    ->exists();
                if (!$exists) {
                    PlanExpireNotification::create([
                        'user_id' => $plan->user->id,
                        'data' => json_encode($notificationData)
                    ]);
                }
            }
        }
        $expiredPlans = Customers::where('plan_id', '!=', null)->where('is_active', false)->get();
        Log::info('Expired plans found for post-expiry reminder: ' . $expiredPlans->count());
        foreach ($expiredPlans as $plan) {
            $planHistory = PlanPurchaseHistory::where('user_id', $plan->id)->where('plan_id',$plan->plan_id)->oldest()   // 👈 this gives first record
            ->first();//->latest()->first();
            if (!$planHistory) {
                continue;
            }
            $today = now();
            $expireDate = $planHistory->end_date;
            // $uptoDay
            // Days after expiry
            $daysAfterExpiry = $expireDate->diffInDays($today, false);

            // Only Day 1 to Day 7 after expiry
            if ($daysAfterExpiry >= 1 && $daysAfterExpiry <= 60) {

                // Check already sent today
                // $alreadySent = PlanExpireNotification::where('user_id', $plan->user_id)
                //     ->whereDate('created_at', $today)
                //     ->where('type', 'daily_expiry_reminder')
                //     ->exists();

                // if (!$alreadySent) {

                    if ($this->sendEmail) {
                        Log::info("Sending Day {$daysAfterExpiry} expiry mail to: " . $plan->email);

                        Mail::to($plan->email)
                            ->queue(new PlanExpiryReminder(
                                $plan,
                                $planHistory->plan,  
                                $daysAfterExpiry,
                                $expireDate
                            ));
                    }

                    // Save notification (to prevent duplicate same-day send)
                    PlanExpireNotification::create([
                        'user_id' => $plan->user_id,
                        'data'    => json_encode([
                            'plan_name' => $plan->plan->name,
                            'day' => $daysAfterExpiry,
                            'expire_date' => $expireDate->format('Y-m-d'),
                            'message' => "Your plan expired {$daysAfterExpiry} days ago."
                        ])
                    ]);
                // }
            }
        }
        Log::info('Plan Expiry Job Completed');
    }
}
