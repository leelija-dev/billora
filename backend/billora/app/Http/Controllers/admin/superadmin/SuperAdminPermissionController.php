<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission; 
class SuperAdminPermissionController extends Controller
{
    public function index(){
        $permissions = Permission::paginate(10);
        $totalPermissions = Permission::count();
        $activePermissions = Permission::count();
        $inactivePermissions = Permission::count();

        return view('admin.admin_permission.index',compact('permissions','totalPermissions','activePermissions','inactivePermissions'));
    }
    public function create(){
        return view('admin.admin_permission.create');
    }
    public function store(Request $request){
        $permission = $request->validate([
            'name' => 'required', 
        ]);

        $permission['slug']=Str::slug($permission['name']);

        Permission::create([
            'name' => $permission['name'],
            'guard_name' => 'admin',
        ]);
        return redirect()->route('admin.permissions.index')->with('success','Permission Created Successfully');
    }
}
