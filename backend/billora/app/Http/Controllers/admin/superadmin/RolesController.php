<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
class RolesController extends Controller
{
    public function index(){
        $roles = Roles::paginate(10);
        return view('admin.role.index',compact('roles'));
    }
    public function create(){
        $permissions = Permission::all();
        return view('admin.role.create',compact('permissions'));
    }
    public function store(Request $request){
        $data = $request->validate([
           'name' => 'required|unique:roles,name', 
        ]);
        try{
         $role = Roles::create([
            'name' => $request->name,
            'guard_name' => 'admin' //
        ]);
            if (!empty($request->permissions)) {
                foreach ($request->permissions as $name) {
                    $role->givePermissionTo(($name));
                }
            }
        }catch(\Exception $e){
            dd($e->getMessage());
            return redirect()->back()->with('error',$e->getMessage());
        }
        return redirect()->route('admin.roles.index')->with('success','Role Created Successfully');
    } 
    public function edit($id){
        $role = Roles::findOrFail($id);
        $permissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();
        return view('admin.role.edit',compact('role','permissions','rolePermissions'));
    } 
    public function update(Request $request,$id){
        $data = $request->validate([
           'name' => 'required|unique:roles,name,'.$id, 
           
        ]);
        try{
        $role = Roles::findOrFail($id);
        $role->update([
            'name' => $request->name,
            'guard_name' => 'admin'
        ]);
        $role->syncPermissions($request->permissions);
        }catch(\Exception $e){
            dd($e->getMessage());
            return redirect()->back()->with('error',$e->getMessage());
        }
        return redirect()->route('admin.roles.index')->with('success','Role Updated Successfully');
    }
    public function delete($id){
        $role = Roles::findOrFail($id);
        $role->delete();
        return redirect()->route('admin.roles.index')->with('success','Role Deleted Successfully');
    }
}
