<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
class Invoice extends Model
{
    use SoftDeletes;
    protected $table="invoice";
    protected $fillable =[
        'user_id',
        'customer_id',
        'store_id',
        'total_amount',
        'total_items',
        'paid_amount',
        'created_by',

    ];
        protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

}
