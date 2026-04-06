<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminUser;
class AdminUserController extends Controller
{
    public function index(){
        $users=AdminUser::paginate(10);
        $totalUser = AdminUser::count();
        // $totalActiveUser = AdminUser::where('status',1)->count();
        return view('admin.admin_user.index',compact('users','totalUser'));
    }
    public function create(){
        return view('admin.admin_user.create');
    }
}
