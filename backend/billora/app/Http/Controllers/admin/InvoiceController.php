<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;
use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\Stocks;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\Store;
use App\Models\BillCustomer;
use App\Models\BillPaymentHistory;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {

        // $products = Products::with([
        //     'brand' => function ($b) {
        //         $b->withTrashed();
        //     },
        //     'category' => function ($c) {
        //         $c->withTrashed();
        //     },
        //     'unit',
        //     'stocks'
        // ])
        //     ->where('is_active', true)
        //     ->get()
        //     ->flatMap(function ($product) {

        //         $unitName = $product->unit ?
        //             (is_object($product->unit) ? $product->unit->code : $product->unit)
        //             : ($product->unit ?? 'pcs');

        //         return $product->stocks->map(function ($stock) use ($product, $unitName) {

        //             return [
        //                 'id' => $product->id ?? '',
        //                 'name' => $product->name ?? '',
        //                 'price' => (float) $product->price ?? '',
        //                 'purchase_price' => (float) $stock->purchase_price ??  '',
        //                 'sku' => $product->sku,
        //                 'company' => $product->brand ? $product->brand->name : 'Other',
        //                 'category' => $product->category ? $product->category->name : 'Other',
        //                 'unit_amount' => $product->unit_amount ?? '',
        //                 'unit' => $unitName ?? '',
        //                 'stock_quantity' => (float) $stock->product_package_quantity ?? '',
        //                 'hsn_code' => $product->hsn_code ?? null,
        //                 'stocks' => [[
        //                     'id' => $stock->id ?? '',
        //                     'purchase_price' => (float) $stock->purchase_price ?? '',
        //                     'purchase_price_gst' => (float) $stock->purchase_price_gst ?? '',
        //                     'selling_price' => (float) $stock->selling_price ?? '',
        //                     'selling_price_gst' => (float) $stock->selling_price_gst ?? '',
        //                     // 'discount' => (float) $stock->discount_percentage,
        //                     // 'quantity_in_stock' => (float) $stock->product_package_quantity,
        //                     'stock_quantity_unit' => $stock->unit->code ?? '',
        //                     // 'unit_amount' => (float) $stock->unit_amount,
        //                     'unit_id' => $stock->unit_id ?? '',
        //                     'created_at' => $stock->created_at ?? '',
        //                     'updated_at' => $stock->updated_at ?? ''
        //                 ]]
        //             ];
        //         });
        //     });

        // $customers = Customers::all();

        // return response()->json([
        //     'status' => true,
        //     'message' => 'Products and Customers List',
        //     'products' => $products,
        //     'customers' => $customers
        // ]);
        $products = Products::with(['brand', 'category', 'unit', 'stocks'])
            ->where('is_active', true)
            ->whereHas('stocks')
            ->get();
        $customers = BillCustomer::all();
        $stores = Store::all();
        return response()->json([
            'status' => true,
            'message' => 'Products and Customers List',
            'products' => $products,
            'customers' => $customers,
            'stores' => $stores
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            "user_id"       => 'required',
            "customer_id"   => 'required|exists:bill_customer,id',
            "store_id"      => 'required|exists:store,id',
            "paid_amount"   => 'required|numeric|min:0',
            "created_by"    => 'required',
        ]);

        DB::beginTransaction();

        try {

            $items = $request->items;

            $totalAmount = 0;
            $totalItems = count($items);

            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];
                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);

                $itemTotal = ((($price * $qty) - $discount) + $gst);

                $totalAmount += $itemTotal;
            }

            // Store invoice
            $invoice = Invoice::create([
                'user_id' => $request->user_id,
                'customer_id' => $request->customer_id,
                'store_id' => $request->store_id,
                'total_amount' => $totalAmount,
                'total_items' => $totalItems,
                'paid_amount' => $request->paid_amount,
                'created_by' => $request->created_by,
            ]);

            // Store invoice items
            foreach ($items as $item) {

                $price = $item['price'];
                $qty = $item['quantity'];

                $discount = ((($price * $qty) * $item['discount'] ?? 0) / 100);
                $gst = (((($price * $qty) - $discount) * $item['gst'] ?? 0) / 100);
                $totalPrice = ((($price * $qty) - $discount) + $gst);

                InvoiceItems::create([
                    'user_id' => $request->user_id,
                    'invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $qty,
                    'item_count' => $qty,
                    'unit_id' => $item['unit_id'],
                    'price' => $price,
                    'gst' => $item['gst'] ?? 0,
                    'discount' => $item['discount'] ?? 0,
                    'total_price' => $totalPrice,
                    'status' => 'completed',
                    'created_by' => $request->created_by
                ]);
            }
            // payment history
            BillPaymentHistory::create([
                'admin_id'       => $request->user_id,
                'invoice_id'     => $invoice->id,
                'customer_id'    => $request->customer_id,
                'store_id'       => $request->store_id,
                'total_amount'   => $totalAmount,
                'paid_amount'    => $request->paid_amount,
                'due_amount'     => $totalAmount - $request->paid_amount,
                'payment_method' => $request->payment_method ?? 'Cash',
                'transaction_id' => null,
                'created_by'     => $request->created_by
            ]);
            // update due amount in customer 
            $customer = BillCustomer::find($request->customer_id);
            $due_amount = ($customer->due_amount + ($totalAmount - $request->paid_amount));
            $customer->update([
                'due_amount' => $due_amount
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Invoice Created Successfully',
                'invoice_id' => $invoice->id
            ]);
        } catch (\Exception $e) {

            DB::rollback();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function show($id)
    {
        try {
            $bill = Invoice::with('invoiceItems')->findOrFail($id);
            // $invoiceitems = InvoiceItems::where('invoice_id', $id)->get();
            return response()->json([
                'status' => true,
                'message' => 'Single Bill',
                'data' => $bill
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function billHistory()
    {
        $billHistory = Invoice::with('invoiceItems')->orderBy('created_at', 'desc')->paginate(15); //with('invoiceItems')->get();

        if ($billHistory === null) {
            return response()->json([
                'status' => false,
                'message' => 'Bill History Not Found'
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'Bill History',
            'data' => $billHistory
        ]);
    }
}
