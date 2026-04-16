<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\MedicineType;
use Illuminate\Support\Facades\Auth;use Illuminate\Http\Request;
use Illuminate\Support\Str;
class MedicineTypeController extends Controller
{
    public function index($id){
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        $user=Auth::user()->id;
        if($id != $user){
            return response()->json([
                'status'    => false,
                'message'   => 'You are not authorized to access this resource.'
            ]);
        }
        try{
        $medicineType = MedicineType::where('user_id', $id)->get();
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type List',
            'data'      => $medicineType
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request){
        try{
        $data = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            
        ]);
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        if($user != $data['user_id']){
            return response()->json([
                'status'    => false,
                'message'   => 'Unauthorized user'
            ]);
        }

        $data['slug'] = Str::slug($data['name']);
        $data['created_by'] = $user;
        $medicineType = MedicineType::create($data);
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type Created Successfully',
            'data'      => $medicineType
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function edit($id){
        try{
            if(!Auth::check()){
                return response()->json([
                    'status'    => false,
                    'message'   => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
        $medicineType = MedicineType::where('id', $id)->where('user_id', $user)->first();
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type Details',
            'data'      => $medicineType
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
    public function update($id, Request $request){
        try{
        $user = Auth::user()->id;
        $data = $request->validate([
            'name' => 'required',
            'user_id' => 'required'
        ]);
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        if($user != $data['user_id']){
            return response()->json([
                'status'    => false,
                'message'   => 'Unauthorized user'
            ]);
        }

        $medicineType = MedicineType::where('id', $id)->where('user_id', $user)->first();
        if(!$medicineType){
            return response()->json([
                'status'    => false,
                'message'   => 'Medicine Type not found'
            ]);
        }
        $data['slug'] = Str::slug($data['name']);
        $medicineType->update($data);
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type Updated Successfully',
            'data'      => $medicineType
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
        
    }
    public function delete($id){
        try{
        $user = Auth::user()->id;
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        
        $medicineType = MedicineType::where('id', $id)->where('user_id', $user)->first();
        if(!$medicineType){
            return response()->json([
                'status'    => false,
                'message'   => 'Medicine Type not found'
            ]);
        }
        $medicineType->delete();
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type Deleted Successfully',
            'data'      => $medicineType
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'    => false,
                'message'   => $e->getMessage()
            ]);
        }
    }
}
