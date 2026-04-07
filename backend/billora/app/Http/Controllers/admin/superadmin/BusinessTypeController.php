<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessPermission;
use App\Models\BusinessType;
use App\Models\InputPermission;
use Google\Service\MyBusinessLodging\Business;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use Illuminate\Support\Str;
class BusinessTypeController extends Controller
{
    public function index(){
        $business_types = BusinessType::paginate(10);
        $total_business_types = BusinessType::count();
        $active_business_types = BusinessType::where('is_active',1)->count();
        $inactive_business_types = BusinessType::where('is_active',0)->count();
        return view('admin.business_type.index',compact('business_types','total_business_types','active_business_types','inactive_business_types'));
    }
    public function create(){
        $inputPermissions = InputPermission::all();
        return view('admin.business_type.create',compact('inputPermissions'));
    }
    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required|unique:business_type,name',
            'is_active' => 'required',
            'permissions' => 'required',
        ]);
        try{
        $business_type = BusinessType::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'is_active' => $request->is_active,
        ]);
        foreach($data['permissions'] as $input_permission_id){
            BusinessPermission::create([
                'business_type_id' => $business_type->id,
                'input_permission_id' => $input_permission_id
            ]);
        }
    
        // $bussiness_permissions =
        return redirect()->route('admin.business-types.index')->with('success','Business Type Created Successfully');
        }catch(\Exception $e){
            return redirect()->route('admin.business-types.index')->with('error',$e->getMessage());
        }
        
    }
    public function edit($id){
        $business_type = BusinessType::findOrFail($id);
        $inputPermissions = InputPermission::all();
        $selectedPermissions = BusinessPermission::
        where('business_type_id', $id)
        ->pluck('input_permission_id')
        ->toArray();
        return view('admin.business_type.edit',compact('business_type','inputPermissions','selectedPermissions'));
    }
    public function update($id,Request $request){
        
          $data = $request->validate([
            'name' => 'required|unique:business_type,name,'.$id,
            'is_active' => 'required',
            'permissions' => 'required',
        ]);
        try{
        $business_type = BusinessType::findOrFail($id);
        $business_type->update([
            'name' => $data['name'],
            'is_active' => $request->is_active,
        ]);
        BusinessPermission::where('business_type_id', $id)->delete();
        foreach($data['permissions'] as $input_permission_id){
            BusinessPermission::create([
                'business_type_id' => $business_type->id,
                'input_permission_id' => $input_permission_id
            ]);
        }
    
        // $bussiness_permissions =
        return redirect()->route('admin.business-types.index')->with('success','Business Type Updated Successfully');
        }catch(\Exception $e){
            return redirect()->route('admin.business-types.index')->with('error',$e->getMessage());
        }
    }
    public function delete($id){
        $business_type = BusinessType::findOrFail($id);
        if(!$business_type){
            return redirect()->route('admin.business-types.index')->with('error','Business Type Not Found');
        }
        $business_type->delete();
        return redirect()->route('admin.business-types.index')->with('success','Business Type Deleted Successfully');
    }
}
