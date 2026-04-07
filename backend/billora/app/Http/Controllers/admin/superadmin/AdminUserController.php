<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminUser;
use App\Models\Roles;

class AdminUserController extends Controller
{
    public function index(){
        $users=AdminUser::paginate(10);
        $totalUser = AdminUser::count();
        $roles = Roles::all();
        // $totalActiveUser = AdminUser::where('status',1)->count();
        return view('admin.admin_user.index',compact('users','totalUser','roles'));
    }
    public function create(){
        return view('admin.admin_user.create');
    }
}
