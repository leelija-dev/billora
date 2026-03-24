<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanPermission;
class PlanPermissionController extends Controller
{
    public function index(){
        $planPermission = PlanPermission::paginate(15);
        return view('admin.plan_permission.index',compact('planPermission'));
    }
}
