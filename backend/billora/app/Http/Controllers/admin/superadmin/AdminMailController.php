<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\AdminMailHistory;
use Illuminate\Http\Request;
use PDO;

class AdminMailController extends Controller
{
    public function mailHistory(Request $request){
        $search = $request->input('search');
        $mailHistory = AdminMailHistory::with('customer')->
        when($search, function ($query) use ($search) {
                        $query->where('id', 'like', '%' . $search . '%')
                        ->orWhere('subject', 'like', '%' . $search . '%')
                        ->orWhere('status', 'like', '%' . $search . '%')    
                        ->orWhereHas('customer', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                        });
                    })->orderBy('created_at', 'desc')->paginate(10);
        $totalMails = AdminMailHistory::count();
        $mailSent =  AdminMailHistory::where('status', 'sent')->count();
        $mailFailed = AdminMailHistory::where('status', 'failed')->count();
        return view('admin.email.index', compact('mailHistory', 'totalMails', 'mailSent', 'mailFailed'));
    }
    public function viewMail($id){
        $mailHistory = AdminMailHistory::with('customer')->findOrFail($id);
        return view('admin.email.view-mail', compact('mailHistory'));
    }
}
