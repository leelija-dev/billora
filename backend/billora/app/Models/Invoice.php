<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
class Invoice extends Model
{
    use SoftDeletes;
    protected $table="invoice";
    protected $fillable =[
        'invoice_number',
        'user_id',
        'customer_id',
        'store_id',
        'total_amount',
        'total_items',
        'paid_amount',
        'created_by',
        'status',
        'package_name',
        'package_price',
        'package_size'

    ];
        protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];
    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItems::class);
    }
    public function customer()
    {
        return $this->belongsTo(BillCustomer::class, 'customer_id');
    }
public function packages(){
    return $this->belongsTo(PackageInvoice::class , 'id' , 'invoice_id');
}
public  function store(){
    return $this->belongsTo(Store::class,'store_id');
}

}
