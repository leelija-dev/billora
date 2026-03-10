<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillPaymentHistory extends Model
{
    protected $table = 'bill_payment_history';
    protected $fillable =[
        'admin_id',
        'invoice_id',
        'customer_id',
        'store_id',
        'total_amount',
        'paid_amount',
        'due_amount',
        'payment_method',
        'transaction_id',
        'created_by'
    ];
    protected $casts = [
        'total_amount'=>'decimal:2',
        'paid_amount'=>'decimal:2',
        'due_amount'=>'decimal:2'
    ];
    public function user(){   // admin user
        return $this->belongsTo(Customers::class);
    }
    public function customer(){
        return $this->belongsTo(BillCustomer::class);
    }
    public function invoice(){
        return $this->belongsTo(Invoice::class);
    }
}
