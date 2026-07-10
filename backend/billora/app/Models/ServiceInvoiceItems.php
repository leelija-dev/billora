<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInvoiceItems extends Model
{
    protected $table = 'service_invoice_items';
    protected $fillable = [
        'user_id',
        'invoice_id',
        'customer_id',
        'product_id',
        'quantity',
        'unit_id',
        'price',
        'gst',
        'discount',
        'total_price',
        'status',
        'service_date',
        'created_by',
    ];
    public function product(){
        return $this->belongsTo(Products::class);
    }

    public function unit(){
        return $this->belongsTo(Unit::class);
    }
    public function invoice(){
        return $this->belongsTo(ServiceInvoices::class);
    }
    public function customer(){
        return $this->belongsTo(BillCustomer::class);
    }
}
