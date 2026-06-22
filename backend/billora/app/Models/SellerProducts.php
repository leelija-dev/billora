<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerProducts extends Model
{
    protected $table = 'seller_products';
    protected $fillable = [
        'user_id',
        'seller_id',
        'product_id',
        'stock_id',
        'qty',
        'purchase_price',
        'gst_percentage',
        'total_amount',
        'paid_amount',
        'invoice_number',
        'invoice_date',
        'invoice_image',
        'invoice_image_public_url'
    ];
       
}
