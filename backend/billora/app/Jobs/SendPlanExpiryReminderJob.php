<?php

namespace App\Jobs;

use App\Mail\PlanExpiryReminder;
use App\Models\PlanPurchaseHistory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPlanExpiryReminderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
      //
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
        if ($plans->isEmpty()) {
            Log::warning('No active plans found');
        }
        foreach($plans as $plan)
        {
        // Calculate days left
            $daysLeft = $today->diffInDays($plan->end_date, false);
            $days_before_reminder = config('app.days_reminder');
        // Check if within 7 days
            $expireDate = $plan->end_date;
            if ($daysLeft <= $days_before_reminder && $daysLeft >= 0) {
                Log::info("Sending mail to: " . $plan->user->email);
                Mail::to($plan->user->email)
                    ->queue(new PlanExpiryReminder(
                        $plan->user,
                        $plan->plan,
                        $daysLeft,
                        $expireDate 
                    ));
            }
        }
         Log::info('Plan Expiry Job Completed');
    }
}
