<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockHistory extends Model
{
    protected $table = 'stock_history';
    protected $fillable = [
        'user_id',
        'product_id',
        'seller_id',
        'stock_id',
        'price',
        'gst',
        'discount',
        'quantity',
        'created_by'
    ];
}
