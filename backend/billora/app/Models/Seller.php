<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $table = 'seller';
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'gst_number',
        'address',
        'city',
        'state',
        'pincode'
    ];
    public function sellerProducts(){
        return $this->hasMany(SellerProducts::class);   
    }
}
