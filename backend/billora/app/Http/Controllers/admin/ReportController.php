<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\BillCustomer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Invoice;
use Illuminate\Validation\Rules\In;
use App\Models\InvoiceItems;
use App\Models\Products;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class ReportController extends Controller
{


    public function index(Request $request)
    {
        $userId = Auth::user()->id;

        $cacheKey = "report_{$userId}_" .
            ($request->start_date ?? 'today') . "_" .
            ($request->end_date ?? 'today');

        $fromCache = Cache::has($cacheKey);

        $startTime = microtime(true);

        $startDate = $request->start_date
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::today()->startOfDay();

        $endDate = $request->end_date
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::today()->endOfDay();
        $data = Cache::remember($cacheKey, 600, function () use ($userId, $startDate, $endDate) {
            $totalSales = Invoice::where('user_id', $userId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_items');

            $totalSalesAmount = Invoice::where('user_id', $userId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount');

            // FIXED
            $totalDue = BillCustomer::where('admin_id', $userId)
                ->sum('due_amount');

            // FIXED PROFIT
            $totalProfit = DB::table('invoice_items as ii')
                ->join('invoice as i', 'ii.invoice_id', '=', 'i.id')
                ->where('i.user_id', $userId)
                ->whereBetween('i.created_at', [$startDate, $endDate])
                ->selectRaw('SUM(ii.price * ii.quantity) as revenue')
                ->value('revenue') ?? 0;

            $customerDues = BillCustomer::where('admin_id', $userId)
                ->where('due_amount', '>', 0)
                ->get();
            $salesInvoice = Invoice::where('user_id', $userId)->with('invoiceItems')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get();
            $productSales = DB::table('invoice_items as ii')
                ->join('products as p', 'ii.product_id', '=', 'p.id')
                ->join('invoice as i', 'ii.invoice_id', '=', 'i.id')

                ->where('i.user_id', $userId)

                ->whereBetween('i.created_at', [$startDate, $endDate])

                ->select(
                    'ii.product_id',

                    'p.name as product_name',

                    DB::raw('SUM(ii.quantity) as total_sold'),

                    DB::raw('COUNT(ii.id) as total_orders')
                )

                ->groupBy(
                    'ii.product_id',
                    'p.name'
                )

                ->orderByDesc('total_sold')

                ->get();
            return [
                'total_sales_items' => $totalSales,
                'total_sales_amount' => $totalSalesAmount,
                'total_due' => $totalDue,
                'total_profit' => $totalProfit,
                'customer_dues' => $customerDues,
                'salesItem_details' => $salesInvoice,
                'product_wise_sales' => $productSales
            ];
        });
        $executionTime = microtime(true) - $startTime;
        return response()->json([
            'status' => true,
            'message' => 'Report data',

            'source' => $fromCache ? 'Redis Cache' : 'Database',

            'response_time' => round($executionTime, 4) . ' sec',

            'user_id' => $userId,

            'filter' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],

            'data' => $data
        ]);
    }
}
