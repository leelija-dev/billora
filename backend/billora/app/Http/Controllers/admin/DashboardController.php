<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\BillCustomer;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Products;
use App\Models\UserOrderItems;
use App\Models\UserOrders;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request, $id)
    {

        try {
            $startTime = microtime(true);
            $search = (int) $request->query('search', 7);
            // $date = Carbon::now()
            //     ->subDays($search)
            // ->startOfDay();

            // $cacheKey = "dashboard_{$id}";
            // $cacheKey = "dashboard_{$id}_{$search}";
            // $fromCache = Cache::tags(['dashboards_'.$id])->has($cacheKey);
            // $data = Cache::tags(['dashboards_'.$id])->remember($cacheKey, 300, function () use ($id, $search, $date) {
            // TOTAL STATS
            $date = Carbon::now()->subDays($search ? $search : 7)->format('Y-m-d');
            $totalRevenueFromInvoice = Invoice::where('user_id', $id)->where('created_at', '>=', $date)->sum('total_amount');
            $totalRevenueFromOrders = UserOrders::where('user_id', $id)->where('created_at', '>=', $date)->sum('total_amount');
            $totalRevenue = (float)$totalRevenueFromInvoice + (float)$totalRevenueFromOrders;
            $totalOrdersFromInvoice = Invoice::where('user_id', $id)->where('created_at', '>=', $date)->count();
            $totalOrdersFromOrders = UserOrders::where('user_id', $id)->where('created_at', '>=', $date)->count();
            $totalOrders = (int)$totalOrdersFromInvoice + (int)$totalOrdersFromOrders;
            $totalCustomers = BillCustomer::where('admin_id', $id)->where('created_at', '>=', $date)->count();
            $totalProducts = Products::where('user_id', $id)->where('created_at', '>=', $date)->count();

            // DAILY REVENUE (LAST 7 DAYS)
            $fromDate = Carbon::now()->subDays($search);

            $dailyRevenue = collect();

            foreach ([Invoice::class, UserOrders::class] as $model) {
                $data = $model::selectRaw("
            DATE(created_at) as date,
            SUM(total_amount) as revenue
        ")
                    ->where('user_id', $id)
                    ->where('created_at', '>=', $fromDate)
                    ->groupBy(DB::raw("DATE(created_at)"))
                    ->get();

                $dailyRevenue = $dailyRevenue->merge($data);
            }

            $dailyRevenue = $dailyRevenue
                ->groupBy('date')
                ->map(function ($rows, $date) {
                    return [
                        'date' => Carbon::parse($date)->format('D'),
                        'revenue' => $rows->sum('revenue'),
                    ];
                })
                ->values();
            $totalDue = BillCustomer::where('admin_id', $id)->where('created_at', '>=', $date)->where('due_amount', '>', 0)->sum('due_amount');
            // MONTHLY REVENUE
            $monthlyRevenue = Invoice::select(
                DB::raw("MONTH(created_at) as month"),
                DB::raw("SUM(total_amount) as revenue")
            )
                ->where('user_id', $id)
                ->where('created_at', '>=', $date)
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(function ($row) {
                    return [
                        // 'month' => Carbon::create()->month($row->month)->format('M'),
                        'month' => Carbon::createFromDate(null, $row->month, 1)->format('M'),
                        'revenue' => (float)$row->revenue
                    ];
                });

            // ORDER STATUS

            $orderStatus = [
                'pending' => ((int)Invoice::where('user_id', $id)->where('created_at', '>=', $date)->where('status', 'pending')->count()) + ((int)UserOrders::where('user_id', $id)->where('created_at', '>=', $date)->where('order_status', 'pending')->count()),
                'processing' => ((int)Invoice::where('user_id', $id)->where('created_at', '>=', $date)->where('status', 'processing')->count()) + ((int)UserOrders::where('user_id', $id)->where('created_at', '>=', $date)->where('order_status', 'processing')->count()),
                // 'shipped' => InvoiceItems::where('status', 'shipped')->count(),
                // 'delivered' => InvoiceItems::where('status', 'delivered')->count(),
                'completed' => ((int)Invoice::where('user_id', $id)->where('created_at', '>=', $date)->where('status', 'completed')->count()) + ((int)UserOrders::where('user_id', $id)->where('order_status', 'completed')->count()),
            ];

            // TOP PRODUCTS
            $topProductsFromInvoice = InvoiceItems::select(
                'product_id',
                DB::raw('SUM(quantity) as sales'),
                DB::raw('SUM(total_price) as revenue')
            )
                ->where('user_id', $id)
                ->where('created_at', '>=', $date)
                ->with('product:id,name')
                ->groupBy('product_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->product_id,
                        'name' => $item->product->name ?? '',
                        'sales' => (float) $item->sales,
                        'revenue' => (float) $item->revenue,
                    ];
                })
                ->toArray();   // 

            $topProductsFromOrders = UserOrderItems::select(
                'product_id',
                DB::raw('SUM(quantity) as sales'),
                DB::raw('SUM(quantity * ((price - (price * discount / 100))+((price - (price * discount / 100)) * gst /100)) ) as revenue')
            )
                ->where('user_id', $id)
                ->where('created_at', '>=', $date)
                ->with('product:id,name')
                ->groupBy('product_id')
                ->orderByDesc('sales')
                // ->limit(5)
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
            $topProducts = collect($topProductsFromInvoice)
                ->merge($topProductsFromOrders)
                ->groupBy('id')
                ->map(function ($rows, $productId) {

                    $first = $rows->first();

                    return [
                        'id' => $productId,
                        'name' => $first['name'] ?? 'Unknown Product',
                        'sales' => collect($rows)->sum('sales'),
                        'revenue' => collect($rows)->sum('revenue'),
                    ];
                })
                ->sortByDesc('sales')
                ->take(5)
                ->values();

            // RECENT ORDERS
            $recentOrders = Invoice::with('customer:id,name')
                ->where('user_id', $id)
                ->where('created_at', '>=', $date)
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
            // return [
            //     'stats' => [
            //     'totalRevenue'   => $totalRevenue,
            //     'totalDue'       =>$totalDue,
            //     'totalOrders'    => $totalOrders,
            //     'totalCustomers' => $totalCustomers,
            //     'totalProducts'  => $totalProducts,
            //     'revenueTrend'   => 0,
            //     'ordersTrend'    => 0,
            //     'customersTrend' => 0,
            //     'productsTrend'  => 0
            // ],
            // 'revenueData' => [
            //     'daily'   => $dailyRevenue,
            //     'monthly' => $monthlyRevenue
            // ],
            // 'orderStatus'  => $orderStatus,
            // 'topProducts'  => $topProducts,
            // 'recentOrders' => $recentOrders
            // ];
            // });
            // $executionTime = microtime(true) - $startTime;
            // $data['source'] = $fromCache ? 'cache' : 'database';
            // $data['executionTime'] = round($executionTime, 4) . ' sec';
            // $data["executionTimeInMs"] = round($executionTime * 1000, 2) . ' ms';

            return response()->json([
                'stats' => [
                    'totalRevenue'   => $totalRevenue,
                    'totalDue'       => $totalDue,
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
                'recentOrders' => $recentOrders,
                'daysRange' => $search,
                'dateFrom' => $date,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
