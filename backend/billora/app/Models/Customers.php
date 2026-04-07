<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Customers extends  Authenticatable  //Model
{
 use HasApiTokens, Notifiable;
 
protected $table="customers";

protected $fillable=[
        'name',
        'email',
        'phone',
        'password',
        'email_verified_at',
        'verification_token',
        'remember_token',
        'company_name',
        'gst_number',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'created_by',
        'plan_id',
        'is_active',
        'business_type_id'
];
protected $hidden = [
        'password',
        'remember_token'
    ];
     protected $casts = [
        'email_verified_at' => 'datetime',
    ];

public function plan()
    {
        return $this->belongsTo(Plans::class, 'plan_id');
    }
// Get customer's plan permissions
    public function getPlanPermissions()
    {
        if (!$this->plan) {
            return collect([]);
        }
 
        return \App\Models\PlanPermissionDetails::with('permission')
            ->where('plan_id', $this->plan_id)
            ->where('is_active', true)
            ->get()
            ->pluck('permission');
    }
 
    // Check if customer has specific permission
    public function hasPermission($permissionKey)
    {
        if (!$this->plan) {
            return false;
        }
 
        return \App\Models\PlanPermissionDetails::where('plan_id', $this->plan_id)
            ->whereHas('permission', function($query) use ($permissionKey) {
                $query->where('key', $permissionKey);
            })
            ->where('is_active', true)
            ->exists();
    }
    
 
    // Implement MustVerifyEmail interface methods
    public function hasVerifiedEmail()
    {
        return !is_null($this->email_verified_at);
    }
 
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => now(),
            'verification_token' => null,
        ])->save();
    }
 
    public function getEmailForVerification()
    {
        return $this->email;
    }

}
