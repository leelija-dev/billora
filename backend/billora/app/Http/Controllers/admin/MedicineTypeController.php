<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\MedicineType;
use Illuminate\Support\Facades\Auth;use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
class MedicineTypeController extends Controller
{
    public function index($id){
        if(!Auth::check()){
            return response()->json([
                'status'    => false,
                'message'   => 'Authentication required. Please login first.'
            ]);
        }
        $sartTime = microtime(true);
        $user=Auth::user()->id;
        if($id != $user){
            return response()->json([
                'status'    => false,
                'message'   => 'You are not authorized to access this resource.'
            ]);
        }
        $cacheKey = "medicine_types_{$user}";
        $fromCache = Cache::tags(['medicine_types_user_' . $user])->has($cacheKey);
        try{
        $medicineType = Cache::tags(['medicine_types_user_' . $user])->remember($cacheKey, 600, function () use ($id) {
            return MedicineType::where('user_id', $id)->get();
        });
        $executionTime = microtime(true) - $sartTime;
        return response()->json([
            'status'    => true,
            'message'   => 'Medicine Type List',
            'source'    => $fromCache ? 'Cache' : 'Database',
            'response_time' => round($executionTime, 4) . ' sec',
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
        Cache::tags(['medicine_types_user_' . $user])->flush();
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
            Cache::tags(['medicine_types_user_' . Auth::user()->id])->flush();
             $user = Auth::user()->id;
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
        Cache::tags(['medicine_types_user_' . $user])->flush();
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
        Cache::tags(['medicine_types_user_' . $user])->flush();
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
