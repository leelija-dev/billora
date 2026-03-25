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
class ReportController extends Controller
{


public function index(Request $request)
{
    $userId = Auth::user()->id;

    $startDate = $request->start_date 
        ? Carbon::parse($request->start_date)->startOfDay()
        : Carbon::today()->startOfDay();

    $endDate = $request->end_date 
        ? Carbon::parse($request->end_date)->endOfDay()
        : Carbon::today()->endOfDay();

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

    return response()->json([
        'status' => true,
        'message' => 'Report data',
        'user_id' => $userId,
        'filter' => [
            'start_date' => $startDate,
            'end_date' => $endDate
        ],
        'data' => [
            'total_sales_items' => $totalSales,
            'total_sales_amount' => $totalSalesAmount,
            'total_due' => $totalDue,
            'customer_dues' => $customerDues
        ],
        'salesItem_details' => $salesInvoice
    ]);
}
}
