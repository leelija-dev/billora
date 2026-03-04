<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Products extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'products';
    
    protected $fillable=[
        'user_id',
        'sku',
        'name',
        'brand_id',
        'category_id',
        'unit_amount',
        'unit_id',	
        'description',
        'is_active',
        'created_by'	

    ];
    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    public function category(){
        return $this->belongsTo(Categories::class);
    }
    public function unit(){
        return $this->belongsTo(Unit::class);
    }
    public function user(){
        return $this->belongsTo(Customers::class);
    }
    public function stocks(): HasMany
    {
        return $this->hasMany( Stocks::class, 'product_id');
    }
}
