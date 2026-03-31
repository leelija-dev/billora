<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserOrderItems extends Model
{
    protected $table = 'user_orders_items';
    protected $fillable = [
            'user_id',
            'customer_order_id',  //user_orders table order id 
            'order_id',    // this is for all shop continuous order id
            'product_id',
            'quantity',
            'unit_id',
            'price',
            'gst',
            'discount',
            'status',
            'created_by'
    ];

    public function product(){
        return $this->belongsTo(Products::class, 'product_id');
    }
    public function order(){
        return $this->belongsTo(UserOrders::class, 'customer_order_id');
    }
}
