<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessPermission extends Model
{
    protected $table = 'business_permission';
    protected $fillable = [
        'business_type_id',
        'input_permission_id',
    ];
    public function business_type(){
        return $this->belongsTo(BusinessType::class);
        
    }
    public function input_permission(){
        return $this->belongsTo(InputPermission::class);
        
    }
}
