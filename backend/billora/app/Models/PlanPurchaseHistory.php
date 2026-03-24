<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanPurchaseHistory extends Model
{
    protected $table = 'plan_purchase_history';
    protected $fillable = [
        'user_id',
        'plan_id',
        'price',
        'currency',
        'start_date',
        'end_date',
        'status',
        'payment_id',
        'payment_status',
        'payment_method'
    ];
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function plan(){
        return $this->belongsTo(Plans::class ,'plan_id');
    }
}
