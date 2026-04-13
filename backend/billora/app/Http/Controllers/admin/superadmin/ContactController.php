<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactUs;
class ContactController extends Controller
{
    public function index(){
        $contacts = ContactUs::orderBy('created_at', 'desc')->paginate(10);
        return view('admin.contact_us.index', compact('contacts'));
    }
    public function view($id){
        $contacts = ContactUs::findOrFail($id);
        $contacts->view_status = true;
        $contacts->save();
        return view('admin.contact_us.view', compact('contacts'));
    }
}
