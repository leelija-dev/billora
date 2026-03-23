<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categories;
use Illuminate\Support\Str;
use App\Models\Customers;
use Illuminate\Support\Facades\Auth;
class CategoriesController extends Controller
{
    public function index(Request $request)
{
    $user = Auth::user()->id;
    $search = $request->search;
    $categories = Categories::where('user_id', $user)
        ->where(function ($query) use ($search) {
            $query->where('id', 'like', "%$search%")
                ->orWhere('name', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%")
                ->orWhere('slug', 'like', "%$search%");
        })
        ->paginate(15);

    return response()->json([
        'status' => true,
        'message' => 'Category List',
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
