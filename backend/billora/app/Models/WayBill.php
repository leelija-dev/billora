<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WayBill extends Model
{
    protected $table = 'waybills';
    protected $fillable = [
    'user_id',
    'waybill_number',
    'invoice_id',
    'waybill_date',

    // Consignor (sender)
    'store_name',
    'store_address',
    'store_gstin',
    'store_phone',

    // Consignee (receiver)
    'customer_name',
    'customer_address',
    'customer_pincode',
    'customer_gstin',
    'customer_phone',

    // Route
    'origin_city',
    'origin_pincode',
    'destination_city',
    'destination_pincode',

    // Transport
    'vehicle_number',
    'transport_mode',

    // Totals & charges
    'total_packages',
    'total_weight',
    'total_value',
    'freight_amount',
    'other_charges',

    // Status & compliance
    'status',
    'delivered_at',
    'invoice_qr',
    'invoice_public_id',
    'waybill_qr',
    'waybill_public_id',
];
}
