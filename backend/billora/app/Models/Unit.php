<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $table="unit";
    protected $fillable=[
        'user_id',
        'code',
        'name',
        'slug',
        'created_by'
    ];

    public function user(){
        return $this->hasMany(Customers::class);
    }

}
