<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\Customers;
use App\Models\PlanPurchaseHistory;
use App\Models\Plans;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->type == 'today') {
            $start = Carbon::today();
            $end = Carbon::today()->endOfDay();
        } elseif ($request->type == 'custom') {
           
            try {
                $start = Carbon::createFromFormat('Y-m-d', $request->start_date)->startOfDay();
                $end = Carbon::createFromFormat('Y-m-d', $request->end_date)->endOfDay();
            } catch (\Exception $e) {
                // Fallback for invalid dates
                if ($request->ajax()) {
                    return response()->json(['status' => false, 'message' => 'Invalid date format']);
                }
                $start = Carbon::now()->startOfMonth();
                $end = Carbon::now()->endOfMonth();
            }
        } elseif ($request->type == 'month') {
            $start = Carbon::now()->startOfMonth();
            $end = Carbon::now()->endOfMonth();
        } else {
            // Default = current month
            $start = Carbon::now()->startOfMonth();
            $end = Carbon::now()->endOfMonth();
        }

        $customerCount = Customers::whereBetween('created_at', [$start, $end])->count();
        $planPurchaseCount = PlanPurchaseHistory::where('payment_status', 'success')
            ->whereBetween('created_at', [$start, $end])
            ->count();
        $contactCount = ContactUs::whereBetween('created_at', [$start, $end])->count();

        // Calculate trend data (monthly)
        $trendLabels = [];
        $trendData = [];

        // Get the last 6 months for trend
        $current = Carbon::now()->subMonths(5)->startOfMonth();
        $endTrend = Carbon::now()->endOfMonth();

        while ($current <= $endTrend) {
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd = $current->copy()->endOfMonth();

            $monthlyCustomers = Customers::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $monthlyPlans = PlanPurchaseHistory::where('payment_status', 'success')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();
            $monthlyContacts = ContactUs::whereBetween('created_at', [$monthStart, $monthEnd])->count();

            $trendLabels[] = $current->format('M Y');
            $trendData[] = $monthlyCustomers + $monthlyPlans + $monthlyContacts;

            $current->addMonth();
        }

        // AJAX response
        if ($request->ajax()) {
            return response()->json([
                'status' => true,
                'data' => [
                    $customerCount,
                    $planPurchaseCount,
                    $contactCount
                ],
                'trend_labels' => $trendLabels,
                'trend_data' => $trendData
            ]);
        }

        $totalUsers = Customers::latest()->get();
        $user = Auth::guard('admin')->user();
        $totalPlanPurchase = PlanPurchaseHistory::where('payment_status', 'success')->latest()->get();
        $toalPlan = Plans::latest()->get();
        $contactUs = ContactUs::latest()->get();

        return view('admin.dashboard', compact(
            'totalUsers',
            'user',
            'totalPlanPurchase',
            'toalPlan',
            'contactUs',
            'customerCount',
            'planPurchaseCount',
            'contactCount',
            'trendLabels',
            'trendData'
        ));
    }
}
