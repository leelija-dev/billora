<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller
{
   public function login(Request $request)
    {
        // Your existing code is perfect!
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
 
        $admin = AdminUser::where('email', $credentials['email'])->first();
        if(!$admin){
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
 
        if(!Hash::check($credentials['password'], $admin->password)){
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        
        //last login
        $admin->update(['last_login_at' => now()]);
        //login user session
        Auth::guard('admin')->login($admin);
 
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'redirect' => route('admin.dashboard')
        ]);
    }
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        
        // Invalidate the session
        $request->session()->invalidate();
        
        // Regenerate CSRF token
        $request->session()->regenerateToken();
 
        return redirect()->route('admin.login')->with('success', 'Logged out successfully');
    }
}
