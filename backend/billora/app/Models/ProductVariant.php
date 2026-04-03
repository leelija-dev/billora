<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use SoftDeletes;
    protected $table = 'product_variant';
    protected $fillable = [
        'user_id',
        'product_id',
        'size',
        'color',
        'material',
        'gender',
        'created_by',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
