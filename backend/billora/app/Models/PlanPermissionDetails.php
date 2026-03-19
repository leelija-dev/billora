<?php

namespace App\Models;
use App\Models\Plans;
use Illuminate\Database\Eloquent\Model;
use Whoops\Handler\PlainTextHandler;

class PlanPermissionDetails extends Model
{
    protected $table = 'plan_permission_details';
    protected $fillable= [
        'plan_id',
        'permission_id'
    ];
    public function plan(){
        return $this->belongsTo(Plans::class);
    }
    public function permission(){
        return $this->belongsTo(PlanPermission::class);
    }
}
