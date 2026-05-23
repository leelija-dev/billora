<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Products;
class InvoiceItems extends Model
{
    protected $table='invoice_items';
    protected $fillable =[
        'user_id',
        'invoice_id',
        'product_id',
        'stock_id',
        'quantity',
        'item_count',
        'unit_id',
        'price',
        'gst',
        'discount',
        'total_price',
        'status',
        'created_by',
                
    ];
    protected $casts = [
        'price' => 'decimal:2',
        'total_price'=>'decimal:2'
    ];
    public function product()
{
    return $this->belongsTo(Products::class, 'product_id');
}
public function stock(){
    return $this->belongsTo(Stocks::class, 'stock_id');
}
}
