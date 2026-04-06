<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\SuperAdminPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class SuperAdminPermissionController extends Controller
{
    public function index(){
        $permissions = SuperAdminPermission::paginate(10);
        $totalPermissions = SuperAdminPermission::count();
        $activePermissions = SuperAdminPermission::where('is_active',1)->count();
        $inactivePermissions = SuperAdminPermission::where('is_active',0)->count();

        return view('admin.admin_permission.index',compact('permissions','totalPermissions','activePermissions','inactivePermissions'));
    }
    public function create(){
        return view('admin.admin_permission.create');
    }
    public function store(Request $request){
        $permission = $request->validate([
            'name' => 'required', 
            'is_active' => 'required',
        ]);

        $permission['slug']=Str::slug($permission['name']);

        SuperAdminPermission::create([
            'name' => $permission['name'],
            'slug' => $permission['slug'],
            'is_active' => $permission['is_active'],
        ]);
        return redirect()->route('admin.permissions.index')->with('success','Permission Created Successfully');
    }
}
