<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class PaymentHistory extends Model
{
    use SoftDeletes;
    protected $table = 'payment_history';
    protected $fillable = [
        'customer_id',
        'plan_id',
        'amount',
        'payment_method',
        'transaction_id',
        'status'
    ];
    protected $casts = [
        'amount' =>'decimal:2'
    ];
}
