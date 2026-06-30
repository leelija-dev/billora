<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categories;
use Illuminate\Support\Str;
use App\Models\Customers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CategoriesController extends Controller
{
    public function index(Request $request)
{
    $user = Auth::user()->id;
    $search = $request->search;
    $status = $request->status;
    // $cacheKey ='categories_' . $user . '_' . md5($search . '_' . $request->page);
    $cacheKey = 'categories_' . $user . '_' . md5($search . '_' . $status . '_' . $request->page);
    $fromCache = Cache::tags(['categories_user_'.$user])->has($cacheKey);

    $startTime = microtime(true);
    $categories = Cache::tags(['categories_user_'.$user])
                      ->remember($cacheKey,600, function () use ($user, $search,$status) {
    Log::info('status'.$status);
    if ($status != null) {

        return Categories::where('user_id', $user)
            ->where('is_active', $status)
            ->where(function ($query) use ($search) {
                if (!empty($search)) {
                    $query->where('id', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                }
            })
            ->orderBy('id', 'desc')
            ->paginate(15);
    }
    return Categories::where('user_id', $user)
        ->where(function ($query) use ($search) {
            $query->where('id', 'like', "%$search%")
                ->orWhere('name', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%")
                ->orWhere('slug', 'like', "%$search%");
        })->orderBy('id','Desc')
        ->paginate(15);
});
    $executionTime = microtime(true) - $startTime;
    return response()->json([
        'status' => true,
        'message' => 'Category List',
        'source' => $fromCache ? 'Cache' : 'Database',
        'response_time' => round($executionTime, 4) . ' sec',
        'data' => $categories
    ]);
}
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'     => 'required',
            'name'        => 'required',
            'is_active'   => 'required',
            'created_by'  => 'nullable',
            'description' => 'nullable'
        ]);
        $user = Auth::user()->id;
        if($user != $data['user_id']){
            return response()->json([
               'status' => false,
               'message' => 'Unauthorized user'
            ]);
        }
        $customer =  Customers::findOrFail($data['user_id']);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        $data['slug'] = Str::slug($data['name']);
        $category = Categories::create($data);
        Cache::tags(['categories_user_'.$user])->flush();
        return response()->json([
            'status' => true,
            'message' => 'Category Created Successfully',
            'data' => $category
        ]);
    }
    public function edit($id)
{
    $user = Auth::user()->id;
     $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
    $category = Categories::where('user_id', $user)
        ->where('id', $id)
        ->first();

    if (!$category) {
        return response()->json([
            'status' => false,
            'message' => 'Category not found'
        ], 404);
    }

    return response()->json([
        'status' => true,
        'message' => 'Single Category Details',
        'data' => $category
    ]);
}
   public function update(Request $request, $id)
{
    try {

        $userId = Auth::user()->id;

        $data = $request->validate([
            'name'        => 'required',
            'is_active'   => 'required',
            'created_by'  => 'nullable',
            'description' => 'nullable'
        ]);
         $customer =  Customers::findOrFail($userId);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        $category = Categories::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();
        if(!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found'
            ], 404);
        }
        $category->update($data);
        Cache::tags(['categories_user_'.$userId])->flush();
        return response()->json([
            'status' => true,
            'message' => 'Category Updated Successfully',
            'data' => $category
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
   
  public function delete($id)
{
    try {

        $user = Auth::user()->id;
        $customer =  Customers::findOrFail($user);
        if($customer->plan_id == null || $customer->is_active == false){
            return response()->json([
                'status' => false,
                'message' =>'You do not have any active plan. Please upgrade your plan.'
            ]);
        }
        $category = Categories::where('user_id', $user)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();
        Cache::tags(['categories_user_'.$user])->flush();
        return response()->json([
            'status' => true,
            'message' => 'Category Deleted Successfully',
            'data' => null
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage()
        ]);
    }
}
}
