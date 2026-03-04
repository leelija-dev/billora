<?php

namespace App\Http\Controllers\admin;

use App\Models\Products;
use App\Http\Controllers\Controller;
use App\Models\Customers;
use Illuminate\Http\Request;

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
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => (float) $product->price,
                        'purchase_price' => (float) $stock->purchase_price,
                        'sku' => $product->sku,
                        'company' => $product->brand ? $product->brand->name : 'Other',
                        'category' => $product->category ? $product->category->name : 'Other',
                        'unit_amount' => $product->unit_amount,
                        'unit' => $unitName,
                        'stock_quantity' => (float) $stock->product_package_quantity,
                        'hsn_code' => $product->hsn_code ?? null,
                        'stocks' => [[
                            'id' => $stock->id,
                            'purchase_price' => (float) $stock->purchase_price,
                            'purchase_price_gst' => (float) $stock->purchase_price_gst,
                            'selling_price' => (float) $stock->selling_price,
                            'selling_price_gst' => (float) $stock->selling_price_gst,
                            'discount' => (float) $stock->discount_percentage,
                            'quantity_in_stock' => (float) $stock->product_package_quantity,
                            'stock_quantity_unit' => $stock->unit->code,
                            'unit_amount' => (float) $stock->unit_amount,
                            'unit_id' => $stock->unit_id,
                            'created_at' => $stock->created_at,
                            'updated_at' => $stock->updated_at
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
}
