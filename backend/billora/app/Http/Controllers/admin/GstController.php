<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;
use App\Models\Invoice;
use Illuminate\Support\Facades\Auth;
use App\Models\GstCollection;
use App\Models\InvoiceItems;
use App\Models\Products;
use App\Models\StockHistory;
use App\Models\Stocks;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class GstController extends Controller 
{
    // public function index($id)
    // {   // id = register user id 
    //     $user = Auth::user()->id;

    //     if ($user != $id) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'unauthorized user'
    //         ]);
    //     }
    //     $start = microtime(true);
        
    //     $cacheKey = "gst_collection_{$user}";
    //     $fromCache = Cache::tags(['gst_collection_user_' . $user])->has($cacheKey);
    //     $data = Cache::tags(['gst_collection_user_' . $user])->remember($cacheKey, 600, function () use ($user, $id) {
    //         $customer = Customers::findOrFail($user);
    //         $permissions = DB::table('plan_permission_details as ppd')
    //             ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
    //             ->where('ppd.plan_id', $customer->plan_id)
    //             ->pluck('pp.slug');

    //         $hasStockPermission = $permissions->contains('stock-management');

    //         $collection = GstCollection::where('user_id', $id)->get();
            
    //         // if($collection->isEmpty()){
    //         //     return response()->json([
    //         //         'status' =>false,
    //         //         'message' => 'gst collection not found',
    //         //         'user_id' => $id
    //         //     ]);
    //         // }
    //         $currentYear = now()->year;
    //          if (now()->month >= 4) {
    //             $fyStart = $currentYear . '-04-01';
    //             $fyEnd = ($currentYear + 1) . '-03-31';
    //         } else {
    //             $fyStart = ($currentYear - 1) . '-04-01';
    //             $fyEnd = $currentYear . '-03-31';
    //         }

    //         /* ------------- Gst Out -------------- */
    //         $gstOut = 0;
    //         if($hasStockPermission){
    //             $purchaseProducts = StockHistory::where('user_id',$id)->where('created_at','>=', $fyStart)->where('created_at','<=', $fyEnd)->get();
    //             foreach($purchaseProducts as $product){
    //                 $stock = Stocks::where('id',$product->stock_id)->where('user_id',$id)->where('product_id',$product->product_id)->first();
    //                 $gstOut +=((($stock->purchase_price * $product->quantity) * $stock->purchase_gst_percentage)/100);
                    
                    
    //             }
    //         }else{
    //             $invoices = InvoiceItems::where('user_id',$id)->where('status', 'completed')->where('created_at','>=', $fyStart)->where('created_at','<=', $fyEnd)->get();
    //             foreach($invoices as $invoice){
    //                 $product = Products::where('id',$invoice->product_id)->where('user_id',$id)->first();
    //                 $gstout += ((($product->purchase_price * $invoice->quantity) * $product->purchase_gst_percentage)/100);
    //             }
    //         }

    //         /* ------------- Gst In -------------- */
    //             $gstIn = 0;
    //             $invoices = InvoiceItems::where('user_id',$id)->where('status', 'completed')->where('created_at','>=', $fyStart)->where('created_at','<=', $fyEnd)->get();
    //             foreach($invoices as $invoice){
    //                 $product = Products::where('id',$invoice->product_id)->where('user_id',$id)->first();
    //                 $totalPrice = $invoice->price * $invoice->quantity; 
    //                 $discountedPrice = (($totalPrice * $invoice->discount)/100); 
    //                 $gstIn += (($discountedPrice * $product->selling_gst_percentage)/100);
    //             }


    //         $data = GstCollection::where('user_id', $id)->where('invoice_status', 'completed')->orderBy('created_at', 'desc')->get();
    //         // $totalGst = GstCollection::where('user_id', $id)->sum(DB::raw('selling_gst_amount * quantity'));
    //         // $dueGstPayGovt = GstCollection::where('user_id', $id)->where('govt_pay_status', false)->where('invoice_status', 'completed')->sum(DB::raw('selling_gst_amount * quantity'));
    //         // // $allProducts = GstCollection::where('user_id',$id)->get();
    //         // $purchasePriceGst = GstCollection::where('user_id', $id)->sum(DB::raw('purchase_gst_amount * quantity'));
    //         // // if($)

    //         // $sellingPriceGst = GstCollection::where('user_id', $id)->sum(DB::raw('selling_gst_amount * quantity'));
    //         // $g
    //         $allProducts = GstCollection::where('gst_collection.user_id', $id)
    //             ->join('products', 'gst_collection.product_id', '=', 'products.id')
    //             ->select(
    //                 'gst_collection.product_id',
    //                 'products.name',

    //                 // Quantity
    //                 DB::raw('SUM(gst_collection.quantity) as total_quantity'),

    //                 // Purchase
    //                 DB::raw('SUM(gst_collection.purchase_price * gst_collection.quantity) as total_purchase_price'),
    //                 DB::raw('SUM(gst_collection.purchase_gst_amount * gst_collection.quantity) as total_purchase_gst'),

    //                 // Selling
    //                 DB::raw('SUM(gst_collection.selling_price * gst_collection.quantity) as total_selling_price'),
    //                 DB::raw('SUM(gst_collection.selling_gst_amount * gst_collection.quantity) as total_selling_gst'),

    //                 // Discount
    //                 // DB::raw('SUM(selling_discount_percentage) as total_discount_percentage'),

    //                 // Profit
    //                 // DB::raw('SUM((selling_price - purchase_price) * quantity) as total_profit'),

    //                 // Total entries
    //                 DB::raw('COUNT(*) as total_products')
    //             )
    //             ->groupBy(
    //                 'gst_collection.product_id',
    //                 'products.name'
    //             )
    //             // ->with('product')
    //             ->get();
    //         return [
    //             'status' => true,
    //             'message' => 'gst collection list',
    //             // 'Total GST' => $totalGst,
    //             // 'Govt GST Due' => $dueGstPayGovt,
    //             'gst_in' => $gstIn,   // product purchase  gst
    //             'gst_out' =>  $gstOut,  // product selling gst
    //             'data' => $data,
    //             'all products' => $allProducts,
    //         ];
    //     });
    //     $executionTime = microtime(true) - $start;
    //     $data['source'] = $fromCache ? 'Cache' : 'Database';
    //     $data['response_time'] = round($executionTime, 4) . ' sec';
    //     return response()->json($data);
    // }
    public function index(Request $request, $id)
{
    $user = Auth::user()->id;

    if ($user != $id) {
        return response()->json([
            'status' => false,
            'message' => 'Unauthorized user'
        ], 403);
    }

    $startTime = microtime(true);

    $month = $request->month;
    $year  = $request->year;

    // Default: Current GST Quarter
    if ($month && $year) {

        $fromDate = Carbon::create($year, $month, 1)->startOfMonth();
        $toDate   = Carbon::create($year, $month, 1)->endOfMonth();

    } elseif ($year) {

        $fromDate = Carbon::create($year, 1, 1)->startOfYear();
        $toDate   = Carbon::create($year, 12, 31)->endOfYear();

    } else {

        $currentMonth = now()->month;
        $currentYear  = now()->year;

        if ($currentMonth >= 4 && $currentMonth <= 6) {
            $fromDate = Carbon::create($currentYear, 4, 1);
        } elseif ($currentMonth >= 7 && $currentMonth <= 9) {
            $fromDate = Carbon::create($currentYear, 7, 1);
        } elseif ($currentMonth >= 10 && $currentMonth <= 12) {
            $fromDate = Carbon::create($currentYear, 10, 1);
        } else {
            $fromDate = Carbon::create($currentYear, 1, 1);
        }

        $toDate = now();
    }
    $page=$request->page ?? 1;
    $cacheKey = "gst_collection_{$user}_page{$page}_{$fromDate->format('Ymd')}_{$toDate->format('Ymd')}";

    $fromCache = Cache::tags(['gst_collection_user_' . $user])->has($cacheKey);

    $data = Cache::tags(['gst_collection_user_' . $user])
        ->remember($cacheKey, 600, function () use ($id, $fromDate, $toDate) {

            $customer = Customers::findOrFail($id);

            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug');

            $hasStockPermission = $permissions->contains('stock-management');

            /*------------ GST OUT = Purchase GST ------------*/
            $gstOut = 0;

            if ($hasStockPermission) {

                $purchaseHistory = StockHistory::with('stock')
                    ->where('user_id', $id)
                    ->whereBetween('created_at', [$fromDate, $toDate])
                    ->get();

                foreach ($purchaseHistory as $history) {

                    if (!$history->stock) {
                        continue;
                    }

                    $gstOut += (
                        ($history->stock->purchase_price * $history->quantity)
                        * $history->stock->purchase_gst_percentage
                    ) / 100;
                }

            } else {

                $invoiceItems = InvoiceItems::with('product','invoice')
                    ->where('user_id', $id)
                    ->where('status', 'completed')
                    ->whereBetween('created_at', [$fromDate, $toDate])
                    ->get();

                foreach ($invoiceItems as $item) {

                    if (!$item->product) {
                        continue;
                    }

                    $gstOut += (
                        ($item->product->purchase_price * $item->quantity)
                        * $item->product->purchase_gst_percentage
                    ) / 100;
                }
            }

            /*----------------------- GST IN = Selling GST -----------------------*/
            $gstIn = 0;

            $invoiceItems = InvoiceItems::with('product','invoice')
                ->where('user_id', $id)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$fromDate, $toDate])
                ->get();

            foreach ($invoiceItems as $item) {

                if (!$item->product) {
                    continue;
                }

                $totalPrice = $item->price * $item->quantity;

                $discountAmount = ($totalPrice * $item->discount) / 100;

                $finalAmount = $totalPrice - $discountAmount;

                $gstIn += ($finalAmount * $item->gst) / 100;
            }

            $gstCollection = GstCollection::where('user_id', $id)
                ->where('invoice_status', 'completed')
                ->whereBetween('created_at', [$fromDate, $toDate])
                ->with('invoice:id,invoice_number')
                ->orderByDesc('created_at')
                ->paginate(15);

            $allProducts = GstCollection::where('gst_collection.user_id', $id)
                ->whereBetween('gst_collection.created_at', [$fromDate, $toDate])
                ->join('products', 'gst_collection.product_id', '=', 'products.id')
                ->select(
                    'gst_collection.product_id',
                    'products.name',
                    DB::raw('SUM(gst_collection.quantity) as total_quantity'),
                    DB::raw('SUM(gst_collection.purchase_price * gst_collection.quantity) as total_purchase_price'),
                    DB::raw('SUM(gst_collection.purchase_gst_amount * gst_collection.quantity) as total_purchase_gst'),
                    DB::raw('SUM(gst_collection.selling_price * gst_collection.quantity) as total_selling_price'),
                    DB::raw('SUM(gst_collection.selling_gst_amount * gst_collection.quantity) as total_selling_gst'),
                    DB::raw('COUNT(*) as total_products')
                )
                ->groupBy(
                    'gst_collection.product_id',
                    'products.name'
                )
                ->paginate(15);

            return [
                'status' => true,
                'message' => 'GST collection list',
                'date_from' => $fromDate->format('Y-m-d'),
                'date_to' => $toDate->format('Y-m-d'),
                'gst_out' => round($gstOut, 2), // Purchase GST
                'gst_in' => round($gstIn, 2),   // Selling GST
                // 'gst_payable' => round($gstIn - $gstOut, 2),
                'data' => $gstCollection,
                'all_products' => $allProducts,
            ];
        });

    $executionTime = microtime(true) - $startTime;

    $data['source'] = $fromCache ? 'Cache' : 'Database';
    $data['response_time'] = round($executionTime, 4) . ' sec';

    return response()->json($data);
}
    public function productDetails($id)
    {
        $user = Auth::user()->id;
        $allProducts = GstCollection::where('user_id', $user)->where('product_id', $id)->with('product')->get();
        if ($allProducts->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'gst collection product not found',
                'product_id' => $id
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'gst collection product list',
            'all products' => $allProducts
        ]);
    }
    public function updateStatus($id)   // id = gst collection id
    {
        $user = Auth::user()->id;
        $product = GstCollection::where('user_id', $user)->where('id', $id)->first();
        $product->update([
            'govt_pay_status' => true,

        ]);
        Cache::tags(['gst_collection_user_' . $user])->flush();
        return response()->json([
            'status' => true,
            'message' => 'status updated successfully'
        ]);
    }
}
