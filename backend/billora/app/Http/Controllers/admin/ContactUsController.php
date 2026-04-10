<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactUsController extends Controller
{
    public function index(){
        
    }
    public function store(Request $request)
    {
        try{
        $data = $request->validate([
           'name' => 'required',
           'email' => 'required|email',
           'phone' => 'required',
           'subject' => 'required',
           'message' => 'required',
        ]);
        ContactUs::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message
        ]);
        $admin_mail_id = config('app.admin_mail');
        // $customerMail = $this->customerMail($data['name'], $data['email'], $data['phone'], $data['subject'], $data['message']);
        // $adminMail = $this->adminMail($data['name'], $data['email'], $data['phone'], $data['subject'], $data['message']);
        // Mail::html($customerMail, function ($message) use ($data) {
        //     $message->to($data['email'])
        //             ->subject($data['subject']);
        // });
        // Mail::html($adminMail, function ($message) use ($data, $admin_mail_id) {
        //     $message->to($admin_mail_id)
        //             ->subject($data['subject']);
        // });
        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully'
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }


    }
    public function adminMail($name, $email, $phone, $subject, $message){
        
    }
    public function customerMail($name, $email, $phone, $subject, $message){
        
    }
}
