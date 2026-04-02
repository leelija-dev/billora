<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plans extends Model
{
    use SoftDeletes;

    protected $table = 'plans';

    protected $fillable = [
        'name',
        'slug',
        'price',
        'created_by',
        'features',
        'description',
        'is_active',
        'duration_days',
        'currency',
        'gst',
        'discount'
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean:2',
        'duration_days' => 'integer',
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'gst' => 'decimal:2',
    ];
    public function planPermissions()
    {
        return $this->hasMany(PlanPermission::class);
    }
    public function planPermissionDetails()
    {
        return $this->hasMany(PlanPermissionDetails::class);
    }
    public function permissions()
    {
        return $this->belongsToMany(
            PlanPermission::class,
            'plan_permission_details', // pivot table
            'plan_id',
            'permission_id'
        );
    }
}
