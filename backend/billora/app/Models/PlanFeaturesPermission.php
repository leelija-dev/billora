<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanFeaturesPermission extends Model
{
    protected $table = 'features_permission';
    protected $fillable =[
        'feature_id',
        'plan_id'
    ];
    public function feature()
    {
        return $this->belongsTo(Features::class, 'feature_id');
    }
    public function plan()
    {
        return $this->belongsTo(Plans::class, 'plan_id');
    }
}
