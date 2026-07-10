<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ServiceInvoices extends Model
{
    use SoftDeletes;
    protected $table = 'service_invoices';
    protected $fillable = [
        'invoice_number',
        'user_id',
        'customer_id',
        'store_id',
        'total_amount',
        'total_items',
        'paid_amount',
        'created_by',
        'status',
    ];

    public function customer(){
        return $this->belongsTo(BillCustomer::class, 'customer_id');
    }
    public function store(){
        return $this->belongsTo(Store::class, 'store_id');
    }
}
