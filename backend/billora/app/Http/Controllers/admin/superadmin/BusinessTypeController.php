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
        return view('admin.business_type.index',compact('business_types'));
    }
    public function create(){
        $inputPermissions = InputPermission::all();
        return view('admin.business_type.create',compact('inputPermissions'));
    }
    public function store(Request $request){
        $data = $request->validate([
            'name' => 'required',
            'is_active' => 'required',
            'permissions' => 'required',
        ]);
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

        
    }
}
