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
        'selling_price',
        'product_package_id',
        'quantity',
        'unit_id',
        'created_by' 
    ];
    public function product(){
        return $this->belongsTo(Products::class);
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
}
