<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactUs;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
class ContactController extends Controller
{
    public function index(Request $request)
{
  $cacheKey = "contacts_index_" . md5($request->fullUrl());
    $data = Cache::tags(['contacts'])->remember($cacheKey,600,function () use ($request) {
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
        return [
          'contacts' => $contacts
        ];
    });
    return view('admin.contact_us.index', $data);
  }
    public function view($id){
        $contacts = ContactUs::findOrFail($id);
        $contacts->view_status = true;
        $contacts->save();
        Cache::tags(['contacts'])->flush();
        return view('admin.contact_us.view', compact('contacts'));
    }
    public function sendMail($id){
        $contacts = ContactUs::findOrFail($id);
        return view('admin.contact_us.send-mail', compact('contacts'));
    }
    public function mailSend(Request $request){
        
        $data = $request->validate([
            'customer_id' => 'required|exists:contact_us,id',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);
        $contacts = ContactUs::findOrFail($data['customer_id']);
        try{
        if($contacts){
        $mailTemplete = $this->customerMail($request->subject, $request->message, $request->customer_id);
        $mail=Mail::html($mailTemplete, function ($message) use ($contacts, $request) {
            $message->to($contacts->email)
                    ->subject($request->subject);
        }); 
        }
        
        // $contacts->reply_message = $request->message;
        // $contacts->save();
        
        return redirect()->route('admin.contacts.index')->with('success', 'Mail sent successfully.');
        }catch(\Exception $e){
            return redirect()->route('admin.contacts.index')->with('error', 'Failed to send mail. Please try again.');
        }
    }
    public function customerMail($subject,$message,$customer_id){
        $contacts = ContactUs::findOrFail($customer_id);
        $html = "
        <!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Billora | Test Mail</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #111;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    .container {
      max-width: 600px;
      margin: 50px auto;
      padding: 0 20px;
    }

    /* Heading */
    .logo {
      text-align: center;
      font-size: 26px;
      font-weight: 700;
      color: #2563eb; /* Primary color */
      margin-bottom: 10px;
    }

    .subject {
      text-align: center;
      font-size: 13px;
      letter-spacing: 2px;
      color: #6b7280;
      margin-bottom: 30px;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 20px 0 30px;
    }

    /* Content */
    .content {
      padding-left: 10px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .text {
      font-size: 15px;
      color: #374151;
      line-height: 1.7;
      margin-bottom: 25px;
    }

    .box {
      border: 1px solid #e5e7eb;
      padding: 16px;
      border-radius: 8px;
      background: #fafafa;
      font-size: 14px;
      color: #333;
      margin-bottom: 25px;
    }

    .signature {
      font-size: 15px;
      margin-top: 20px;
      text-align: right;
      padding: 10px;
    }

    /* Footer */
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }

    @media(max-width:600px){
      .container {
        margin: 30px auto;
      }
    }
  </style>
</head>

<body>

  <table>
    <tr>
      <td>

        <div class='container'>

          <!-- Heading -->
          <div class='logo'>". config('app.name') ."</div>

          
          <div class='divider'></div>

          <!-- Content -->
          <div class='content'>

            <div class='title'>Hello ".$contacts->name.",</div>

            <div class='text'>
              ".$message."
            </div>


            <div class='signature'>
              <span style='padding-right:10px;'>Thank you,</span><br>
              <strong>".config('app.name')." Team</strong>
            </div>

          </div>

          <!-- Footer -->
          <div class='footer'>
            © ".date('Y')." ".config('app.name').". All rights reserved.
          </div>

        </div>

      </td>
    </tr>
  </table>

</body>
</html> ";

        return $html;
    } 
}
