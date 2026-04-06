<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlanPermission;
use Illuminate\Support\Str;

class PlanPermissionController extends Controller
{
    public function index(){
        $planPermission = PlanPermission::paginate(15);
        return view('admin.plan_permission.index',compact('planPermission'));
    }

    public function create(){
        return view('admin.plan_permission.create');
    }
    public function store(Request $request){
        try{
        $permission = $request->validate([
            'name' => 'required', 
            'description' => 'nullable',
            'is_active' => 'required',
        ]);

        $permission['slug']=Str::slug($permission['name']);

        PlanPermission::create([
            'permission_name' => $permission['name'],
            'slug' => $permission['slug'],
            'description' => $permission['description'],
            'is_active' => $permission['is_active'],

            ]);

        return redirect()->route('admin.plan-permission.index')->with('success','Plan Permission Created Successfully');
        }catch(\Exception $e){
            return redirect()->back()->with('error',$e->getMessage());
        }
    }
    public function edit($id){
        try{
        $planPermission = PlanPermission::findOrFail($id);
        return view('admin.plan_permission.edit',compact('planPermission'));
        }catch(\Exception $e){
            return redirect()->back()->with('error',$e->getMessage());
        }
    }
    public function update(Request $request,$id){
        try{
        $permission = $request->validate([
           'name' => 'required',
           'description' => 'nullable',
           'is_active' => 'required',
        ]);
        $planPermission = PlanPermission::findOrFail($id);
        $planPermission->update($request->all());
        return redirect()->route('admin.plan-permission.index')->with('success','Plan Permission Updated Successfully');
        }catch(\Exception $e){
            return redirect()->back()->with('error',$e->getMessage());
        }
    }
    public function delete($id){
        try{
        $planPermission = PlanPermission::findOrFail($id);
        $planPermission->delete();
        return redirect()->route('admin.plan-permission.index')->with('success','Plan Permission Deleted Successfully');
        }catch(\Exception $e){
            return redirect()->back()->with('error',$e->getMessage());
        }
    }
}
