<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactUs;
class ContactController extends Controller
{
    public function index(Request $request)
{
    $search = $request->input('search');

    $contacts = ContactUs::query()
        ->when($search, function ($query, $search) {
            if (strtolower($search) === 'new') {
                $query->where('view_status', 0);
            } else {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('created_at', 'like', "%{$search}%");
            });
            }
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return view('admin.contact_us.index', compact('contacts'));
}
    public function view($id){
        $contacts = ContactUs::findOrFail($id);
        $contacts->view_status = true;
        $contacts->save();
        return view('admin.contact_us.view', compact('contacts'));
    }
    public function sendMail($id){
        $contacts = ContactUs::findOrFail($id);
        return view('admin.contact_us.send-mail', compact('contacts'));
    }
}
