<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $table = 'brand';
    protected $fillable =[
        'user_id',
        'name',
        'slug',
        'is_active',
        'created_by',
        'description'
    ];
   protected $casts = [
         'is_active' => 'boolean',
   ];
   public function user(){
    return $this->belongsTo(Customers::class);
   }
}
