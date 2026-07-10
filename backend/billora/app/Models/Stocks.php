<?php

namespace App\Models;
use App\Models\Products;
use Illuminate\Database\Eloquent\Model;

class Stocks extends Model
{
    protected $table="stocks";
    protected $fillable=[
        'user_id',
        'product_id',
        'purchase_price',
        'purchase_gst_percentage',
        'selling_price',
        'selling_gst_percentage',
        'product_package_id',
        'quantity',
        'unit_id',
        'seller_id',
        'seller_product_id',
        'qr_code',
        'qr_code_public_id',
        'bar_code',
        'bar_code_public_id',
        'created_by' 
    ];
    public function product(){
        return $this->belongsTo(Products::class , 'product_id');
    }
    public function unit(){
        return $this->belongsTo(Unit::class);
    }
    public function category(){
        return $this->belongsTo(Categories::class);
    }
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    public function user(){
        return $this->belongsTo(Customers::class);
    }
    public function variant(){
        return $this->belongsTo(ProductVariant::class, 'product_id');
    }
    public function sellerProduct(){
        return $this->belongsTo(SellerProducts::class, 'seller_product_id');
    }
}
 