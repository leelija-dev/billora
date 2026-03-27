<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserOrders extends Model
{
    protected $table = 'user_orders';
    protected $fillable = [
        'user_id',
        'order_id',              
        'store_id',
        'total_items',
        'total_amount',
        'paid_amount',
        'payment_status',
        'payment_method',
        'order_status',
        'customer_name',
        'customer_phone',
        'order_by',
        'created_by'
        
    ];
}
