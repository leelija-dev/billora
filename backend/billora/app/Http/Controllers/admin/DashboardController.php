<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\BillCustomer;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function index($id){
        
    try {

        // TOTAL STATS
        $totalRevenue = Invoice::where('user_id',$id)->sum('total_amount');
        $totalOrders = Invoice::where('user_id',$id)->count();
        $totalCustomers = BillCustomer::where('admin_id',$id)->count();
        $totalProducts = Products::where('user_id',$id)->count();

        // DAILY REVENUE (LAST 7 DAYS)
        $dailyRevenue = Invoice::select(
                DB::raw("DATE(created_at) as date"),
                DB::raw("SUM(total_amount) as revenue")
            )
            ->where('user_id',$id)
            ->whereDate('created_at', '>=', Carbon::now()->subDays(6))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => Carbon::parse($row->date)->format('D'),
                    'revenue' => (float)$row->revenue
                ];
            });
        $totalDue = BillCustomer::where('admin_id',$id)->where('due_amount', '>', 0)->sum('due_amount');
        // MONTHLY REVENUE
        $monthlyRevenue = Invoice::select(
                DB::raw("MONTH(created_at) as month"),
                DB::raw("SUM(total_amount) as revenue")
            )
            ->where('user_id',$id)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => Carbon::create()->month($row->month)->format('M'),
                    'revenue' => (float)$row->revenue
                ];
            });

        // ORDER STATUS
        $orderStatus = [
            'pending' => Invoice::where('user_id',$id)->where('status', 'pending')->count(),
            'processing' => Invoice::where('user_id',$id)->where('status', 'processing')->count(),
            // 'shipped' => InvoiceItems::where('status', 'shipped')->count(),
            // 'delivered' => InvoiceItems::where('status', 'delivered')->count(),
            'completed' => Invoice::where('user_id',$id)->where('status', 'completed')->count(),
        ];

        // TOP PRODUCTS
        $topProducts = InvoiceItems::select(
                'product_id',
                DB::raw('SUM(quantity) as sales'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->where('user_id',$id)
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('sales')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name ?? '',
                    'sales' => $item->sales,
                    'revenue' => $item->revenue,
                    'trend' => '+0%'
                ];
            });

        // RECENT ORDERS
        $recentOrders = Invoice::with('customer:id,name')
            ->where('user_id',$id)  
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'orderNumber' => $invoice->id,
                    'customer' => [
                        'name' => $invoice->customer->name ?? ''
                    ],
                    'total' => $invoice->total_amount,
                    'status' => $invoice->status ?? '',
                    'items' => [
                        ['quantity' => $invoice->total_items]
                    ],
                    'createdAt' => $invoice->created_at
                ];
            });

        return response()->json([
            'stats' => [
                'totalRevenue'   => $totalRevenue,
                'totalDue'       =>$totalDue,
                'totalOrders'    => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'totalProducts'  => $totalProducts,
                'revenueTrend'   => 0,
                'ordersTrend'    => 0,
                'customersTrend' => 0,
                'productsTrend'  => 0
            ],
            'revenueData' => [
                'daily'   => $dailyRevenue,
                'monthly' => $monthlyRevenue
            ],
            'orderStatus'  => $orderStatus,
            'topProducts'  => $topProducts,
            'recentOrders' => $recentOrders
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
        
}
