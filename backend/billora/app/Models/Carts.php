<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carts extends Model
{
    protected $table ="carts";
    protected $fillable =[
        'user_id',
        'product_id',
        'stock_id',
        'quantity',
        'price',
        'total',
        'created_by'
    ];
    protected $casts = [
        'price'=>'boolean:2',
        'total'=>'boolean:2'
    ];

}
