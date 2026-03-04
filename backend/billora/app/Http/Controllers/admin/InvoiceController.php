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
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        
        $products = Products::with([
            'brand' => function ($b) {
                $b->withTrashed();
            },
            'category' => function ($c) {
                $c->withTrashed();
            },
            'unit',
            'stocks'
        ])
            ->where('is_active', true)
            ->get()
            ->flatMap(function ($product) {

                $unitName = $product->unit ?
                    (is_object($product->unit) ? $product->unit->code : $product->unit)
                    : ($product->unit ?? 'pcs');

                return $product->stocks->map(function ($stock) use ($product, $unitName) {

                    return [
                        'id' => $product->id ?? '',
                        'name' => $product->name ?? '',
                        'price' => (float) $product->price ?? '',
                        'purchase_price' => (float) $stock->purchase_price ??  '',
                        'sku' => $product->sku,
                        'company' => $product->brand ? $product->brand->name : 'Other',
                        'category' => $product->category ? $product->category->name : 'Other',
                        'unit_amount' => $product->unit_amount ?? '',
                        'unit' => $unitName ?? '',
                        'stock_quantity' => (float) $stock->product_package_quantity ?? '',
                        'hsn_code' => $product->hsn_code ?? null,
                        'stocks' => [[
                            'id' => $stock->id ?? '',
                            'purchase_price' => (float) $stock->purchase_price ?? '',
                            'purchase_price_gst' => (float) $stock->purchase_price_gst ?? '',
                            'selling_price' => (float) $stock->selling_price ?? '',
                            'selling_price_gst' => (float) $stock->selling_price_gst ?? '',
                            // 'discount' => (float) $stock->discount_percentage,
                            // 'quantity_in_stock' => (float) $stock->product_package_quantity,
                            'stock_quantity_unit' => $stock->unit->code ?? '',
                            // 'unit_amount' => (float) $stock->unit_amount,
                            'unit_id' => $stock->unit_id ?? '',
                            'created_at' => $stock->created_at ?? '',
                            'updated_at' => $stock->updated_at ?? ''
                        ]]
                    ];
                });
            });

        $customers = Customers::all();

        return response()->json([
            'status' => true,
            'message' => 'Products and Customers List',
            'products' => $products,
            'customers' => $customers
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:shops,id',
            'customer_id' => 'required|exists:customers,id',
            'store_id' => 'required|exists:store,id',
            'created_by' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            
            'items.*.product_id' => 'required|exists:products,id',
            // 'items.*.name' => 'required|string|max:255',
            // 'items.*.price' => 'required|numeric|min:0',
            'items.*gst' => 'required|numeric|min:0',
            'items.*purchase_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.subtotal' => 'required|numeric|min:0|max:99999999.99',
            'total_amount' => 'required|numeric|min:0|max:99999999.99',
            'semi_paid_amount' => 'nullable|numeric|min:0|max:99999999.99',
            //'discount_percent' => 'nullable|numeric|min:0|max:100',
            //'discount_amount' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $store = Store::find($request->store_id);
            if (!$store) {
                throw new \Exception('Store not found with ID: ' . $request->store_id);
            }
            $totalItems = array_sum(array_column($request->items, 'quantity'));
            $totalAmount = $request->total_amount;
            
            $invoiceId = Invoice::insertGetId([
                'user_id'=>$request->user_id,
                'customer_id'=>$request->customer_id,
                'store_id'=>$request->store_id,
                'total_amount'=>$request->total_amount,
                'total_items'=>$totalItems,
                'paid_amount'=>$request->semi_paid_amount,
                'created_by'=>$request->created_by,
            ]);
           $billItems = [];
            foreach ($request->items as $item) {
                $billItems[] = [
                    'invoice_id' => $invoiceId, // This should be the auto-incremented ID from the invoice table
                    'user_id' => $request->user_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'], 
                    'item_count'=>$item['quantity'],
                    'unit_id'=> $item['stock_unit'],
                    // 'quantity_unit' => $item['stock_unit'],
                    'price' => $item['purchase_price'],
                    'gst'=> $item['gst'],
                    'discount' => $item['discount'],
                    'total_price' =>$item['quantity'] * $item['purchase_price'],//$item['subtotal'],
                    'status' => 'completed',
                    'created_by' => $request->created_by,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
             DB::commit();
             return response()->json([
                'success' => true,
                'message' => 'Bill saved successfully',
                'bill_number' => $invoiceId,
                'store' => [
                    'name' => $store->name ?? '',
                    'address' => $store->address ?? '',
                    'mobile' => $store->mobile ?? '',
                    'email' => $store->email ?? '',
                    'logo' => $store->logo ?? '',
                    'gst' => $store->gst ?? '',
                   
                ]
            ]);


        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function show($id){
    
    }
}
