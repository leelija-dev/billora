<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImages extends Model
{
    protected $table = 'products_images';

    protected $fillable = [
        'user_id',
        'product_id',
        'image',
        'created_by'
    ];
    
}
