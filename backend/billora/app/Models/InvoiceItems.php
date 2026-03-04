<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItems extends Model
{
    protected $table='invoice_items';
    protected $fillable =[
        'user_id',
        'invoice_id',
        'product_id',
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
        'price' => 'deciamal:2',
        'total_price'=>'decimal:2'
    ];
}
