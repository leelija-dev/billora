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
        'image_public_id',
        'created_by'
    ];
    
}
