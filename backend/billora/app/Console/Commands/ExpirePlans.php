<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PlanPurchaseHistory;
use Carbon\Carbon;
use App\Models\Customers;
use Illuminate\Support\Facades\Log;

class ExpirePlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expire-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now();

        //  Expire only active plans that are past end_date
        $expiredPlans = PlanPurchaseHistory::where('status', 'active')
            ->whereDate('end_date', '<', $today)
            ->get();

        if ($expiredPlans->isEmpty()) {
            $this->info('No expired plans found.');
            Log::info('No expired plans found.');
            return;
        }

        //update status of those plans as expired
        PlanPurchaseHistory::whereIn('id', $expiredPlans->pluck('id'))
            ->update(['status' => 'expired']);

        //Get affected users
        $userIds = $expiredPlans->pluck('user_id')->unique();

        $deactivatedCount = 0;

        foreach ($userIds as $userId) {
            $customer = Customers::find($userId);
            // Get latest plan of this user
            $latestPlan = PlanPurchaseHistory::where('user_id', $userId)
                ->orderByDesc('end_date')
                ->first();

            // Only deactivate if latest plan is expired
            // if ($latestPlan && \Carbon\Carbon::parse($latestPlan->end_date)->addDays(7)->lt($today)) { 
            //     Customers::where('id', $userId)
            //         ->where('is_active', true)
            //         ->update(['is_active' => false]);

            //     $deactivatedCount++;
            // }
            if (!$latestPlan || !$customer) {
                continue;
            }
            if ($latestPlan) {
                $expiryDate = Carbon::parse($latestPlan->end_date);
                
                if ((int)$latestPlan->price === 0 && $latestPlan->payment_status === 'success' && $latestPlan->plan_mode === 'trial') {
                    $shouldDeactivate = $expiryDate->lt($today);
                } else {
                    // Paid plan => 7 days grace period
                    $shouldDeactivate = $expiryDate->addDays(7)->lt($today);
                }
                if ($shouldDeactivate) {
                    Customers::where('id', $userId)
                        ->where('is_active', true)
                        ->update([
                            'is_active' => false
                        ]);

                    $deactivatedCount++;
                }

            }

             
        }

        $this->info("Expired {$expiredPlans->count()} plans, deactivated {$deactivatedCount} customers.");
        Log::info("Plans expired: {$expiredPlans->count()}, Customers deactivated: {$deactivatedCount}");
    }
}
