<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plans;
use App\Models\PlanPermission;
use App\Models\PlanPermissionDetails;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class PlansController extends Controller
{
        private function checkAdminAuth()
    {
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login')->with('error', 'Please login to access this page.');
        }
    }
   public function index(Request $request)
    {
         $this->checkAdminAuth();
        // Start with base query
        $query = Plans::query();
        
        // Apply search if exists
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('price', 'LIKE', "%{$search}%");
            });
        }
        
        // Get all plans with search applied
       $plans = $query->latest()->paginate(15)->withQueryString();
        
        return view('admin.plans.index', [
            'plans' => $plans,
            'totalPlans' => Plans::withTrashed()->count(),
            'activePlans' => $plans->where('is_active', true)->count(),
            'inactivePlans' => $plans->where('is_active', false)->count(),
           'deletedPlans' => Plans::onlyTrashed()->count(),
            'search' => $request->input('search') // Pass search term back to view
        ]);
    }
    public function create(){
         $this->checkAdminAuth();
         $permissions = PlanPermission::all();
        return view('admin.plans.create',compact('permissions'));
    }
   public function store(Request $request){
     $this->checkAdminAuth();
        $data = $request->validate([
            'name'          =>'required',
            'price'         =>'required',
            'features'      =>'nullable',
            'description'   =>'nullable',
            'is_active'     =>'required',
            'duration_days' =>'required',
            'currency'      =>'nullable',
            'permission'    =>'nullable|array',
        ]);
        $admin = Auth::guard('admin')->user();
        
        // Add admin data
        $data['created_by'] = $admin->name;
        $data['slug'] = Str::slug($data['name']);
        try{
            $plan = Plans::create($data);
            if($plan){
                foreach($data['permission'] as $permission){
                    PlanPermission::create([
                        'plan_id' => $plan->id,
                        'permission_id' => $permission
                    ]);
                }
            }
            return redirect()->route('admin.plans.index')->with('success', 'Plan Created Successfully');
            
        }catch(\Exception $e){

            return redirect()->back()->with('error', $e->getMessage());
            
           
        }
    }
   public function edit($id){
    $this->checkAdminAuth();

    $plan = Plans::findOrFail($id);

    // all permissions list
    $permissions = PlanPermission::all();

    // get saved permission IDs
    $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
                        ->pluck('permission_id')
                        ->toArray();

    return view('admin.plans.edit', compact('plan','permissions','planPermissions'));
}
    public function update(Request $request, $id)
{
    $data = $request->validate([
        'name'          => 'required',
        'price'         => 'required',
        'features'      => 'nullable',
        'description'   => 'nullable',
        'is_active'     => 'nullable|boolean',
        'duration_days' => 'required',
        'currency'      => 'nullable',
        'permissions'   => 'nullable|array',
    ]);

    try {
        $plan = Plans::findOrFail($id);

        // Update plan
        $plan->update($data);

        // Selected permissions from form
        $newPermissions = $request->permissions ?? [];

        // Existing permissions in DB
        $oldPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
                            ->pluck('permission_id')
                            ->toArray();

        //  DELETE unchecked permissions
        $toDelete = array_diff($oldPermissions, $newPermissions);

        if (!empty($toDelete)) {
            PlanPermissionDetails::where('plan_id', $plan->id)
                ->whereIn('permission_id', $toDelete)
                ->delete();
        }

        // INSERT new permissions (only new ones)
        $toInsert = array_diff($newPermissions, $oldPermissions);

        foreach ($toInsert as $permission) {
            PlanPermissionDetails::create([
                'plan_id' => $plan->id,
                'permission_id' => $permission
            ]);
        }

        return redirect()->route('admin.plans.index')
            ->with('success', 'Plan Updated Successfully');

    } catch (\Exception $e) {
        return redirect()->back()->with('error', $e->getMessage());
    }
}
    public function delete($id){
        try{
            $plan = Plans::findOrFail($id);
            $plan->delete();
            return redirect()->route('admin.plans.index')->with('success', 'Plan Deleted Successfully');

        }catch(\Exception $e){
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function trashed(){
        $this->checkAdminAuth();
        $plans = Plans::onlyTrashed()->latest()->paginate(15);
        return view('admin.plans.deleted',compact('plans'));
    }
    public function restore($id){
        try{
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->restore();
            return redirect()->route('admin.plans.deleted')->with('success', 'Plan Restored Successfully');
        }catch(\Exception $e){
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function forceDelete($id){
        try{
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->forceDelete();
            return redirect()->route('admin.plans.deleted')->with('success', 'Plan Deleted Permanently');
       
        }catch(\Exception $e){
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
     public function show($id){
    $this->checkAdminAuth();

    $plan = Plans::onlyTrashed()->findOrFail($id);

    // all permissions list
    $permissions = PlanPermission::all();

    // get saved permission IDs
    $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
                        ->pluck('permission_id')
                        ->toArray();

    return view('admin.plans.edit', compact('plan','permissions','planPermissions'));
}
}
