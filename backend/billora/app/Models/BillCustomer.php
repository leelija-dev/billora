<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class BillCustomer extends Model
{
    use SoftDeletes;
    protected $table="bill_customer";
    protected $fillable=[
        'admin_id',  
        'name',  
        'email',  
        'phone', 
        'address',
        'city', 
        'created_by',
        'due_amount'
    ];

    public function paymentHistories()
{
    return $this->hasMany(BillPaymentHistory::class, 'customer_id');
}

}
