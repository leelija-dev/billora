<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GstCollection extends Model
{
    protected $table = 'gst_collection';
    protected $fillable = [
            'user_id',
            'invoice_id',
            'customer_id',
            'product_id',
            'purchase_price', 
            'purchase_gst_percentage',
            'purchase_gst_amount',
            'selling_price', 
            'selling_discount_percentage',
            'selling_gst_percentage',
            'selling_gst_amount', 
            'quantity', 
            'govt_pay_status',
            'invoice_status',
            'created_by'        
    ];
    public function user(){
        return $this->belongsTo(Customers::class , 'user_id');  
    }
    public function invoice(){
        return $this->belongsTo(Invoice::class , 'invoice_id');
    }
    public function  product(){
        return $this->belongsTo(Products::class, 'product_id');
    }
    public function customer(){
        return $this->belongsTo(BillCustomer::class, 'customer_id');
    }
}