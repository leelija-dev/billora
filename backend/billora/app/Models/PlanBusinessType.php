<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanBusinessType extends Model
{
    protected $table = 'plan_business_type';
    protected $fillable = [
        'plan_id',
        'business_type_id',
    ];

    public function plan()
    {
        return $this->belongsTo(Plans::class, 'plan_id');
    }

    public function businessType()
    {
        return $this->belongsTo(BusinessType::class, 'business_type_id');
    }
}
