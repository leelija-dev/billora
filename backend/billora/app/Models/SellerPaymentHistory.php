<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerPaymentHistory extends Model
{
    protected $table = 'seller_payment_history';
    protected $fillable = [
            'user_id',
            'seller_id',
            'invoice_id',
            'paid_amount',
            'payment_method',
            'remarks'
    ];
     

    public function product(){
        return $this->belongsTo(Products::class, 'product_id');
    }
    public function seller(){
        return $this->belongsTo(Seller::class, 'seller_id');
    }
}
