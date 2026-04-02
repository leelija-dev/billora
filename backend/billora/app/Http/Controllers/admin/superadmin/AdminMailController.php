<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\AdminMailHistory;
use Illuminate\Http\Request;
use PDO;

class AdminMailController extends Controller
{
    public function mailHistory(){
        $mailHistory = AdminMailHistory::with('customer')->orderBy('created_at', 'desc')->paginate(10);
        return view('admin.email.index', compact('mailHistory'));
    }
    public function viewMail($id){
        $mailHistory = AdminMailHistory::with('customer')->findOrFail($id);
        return view('admin.email.view-mail', compact('mailHistory'));
    }
}
