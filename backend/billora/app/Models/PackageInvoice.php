<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageInvoice extends Model
{
    protected $table = 'invoice_packages';
    protected $fillable = [
            'user_id',
            'invoice_id',
            'package_id',
            'package_name',
            'package_price',
            'quantity',
            'package_size',
            'created_by'
    ];
    public function customer()
    {
        return $this->belongsTo(Customers::class, 'user_id');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
    public function package()
    {
        return $this->belongsTo(PackageCost::class, 'package_id');
    }

}
