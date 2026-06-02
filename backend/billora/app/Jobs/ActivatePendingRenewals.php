<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\PlanPurchaseHistory;
use App\Models\Customers;
use Carbon\Carbon;
use App\Models\PlanBusinessType;
class ActivatePendingRenewals implements ShouldQueue
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
        $expiredPlans = PlanPurchaseHistory::where('status', 'active')->where('payment_status', 'success')
            ->where('end_date', '<=', now())
            ->get();
        foreach ($expiredPlans as $expiredPlan) {
                $expiredPlan->update([
                'status' => 'expired'
            ]);
            $customer = Customers::find($expiredPlan->user_id);
            if (!$customer) {
                continue;
            }
            // Find next paid renewal
            $pendingRenewal = PlanPurchaseHistory::where('user_id', $customer->id)
                ->where('status', 'pending')
                ->where('payment_status', 'success')
                ->orderBy('created_at')
                ->first();
            if (!$pendingRenewal) {

                $customer->update([
                    'is_active' => false
                ]);

                continue;
            }
            $startDate = now();

            $endDate = Carbon::now()->addDays(
                $pendingRenewal->plan->duration_days
            );
            $pendingRenewal->update([
                'status' => 'active',
                'payment_status' => 'success',
                'start_date' => $startDate,
                'end_date' => $endDate
            ]);
            $businessType = PlanBusinessType::where(
                'plan_id',
                $pendingRenewal->plan_id
            )->first();
            $customer->update([
                'plan_id' => $pendingRenewal->plan_id,
                'business_type_id' => $businessType?->business_type_id,
                'is_active' => true
            ]);
        }

    }
}
