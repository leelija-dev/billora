<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminUser;
use App\Models\Roles;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = AdminUser::paginate(10);
        $totalUser = AdminUser::count();
        $roles = Roles::all();
        // $totalActiveUser = AdminUser::where('status',1)->count();
        return view('admin.admin_user.index', compact('users', 'totalUser', 'roles'));
    }
    public function create()
    {
        $assignRoles = Roles::all();
        return view('admin.admin_user.create', compact('assignRoles'));
    }
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name'        => 'required|string|max:255',
                'email'       => 'required|email|unique:admin_users,email',
                'image'       => 'nullable|image',
                'fname'       => 'required|string|max:255',
                'lname'       => 'required|string|max:255',
                'password'    => 'required',
                'description' => 'nullable|string',
                'roles'       => 'required|array',
                'roles.*'     => 'exists:roles,name',
            ]);
            //   dd($data);
            $folderPath = public_path('uploads/admin_images');

            // Create folder if not exists
            if (!File::exists($folderPath)) {
                File::makeDirectory($folderPath, 0777, true, true);
            }
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = time() . '_' . $image->getClientOriginalName();
                $image->move($folderPath, $fileName);

                $imagePath = 'uploads/admin_images/' . $fileName;
            }
            $user = AdminUser::create([
                'username' => $data['name'],
                'email' => $data['email'],
                'fname' => $data['fname'],
                'lname' => $data['lname'],
                'description' => $data['description'],
                'image' => $imagePath,
                'password' => Hash::make($data['password']),

            ]);
            // $user->syncRoles($data['roles']);
            if (!empty($request->roles)) {
                foreach ($request->roles as $name) {
                    $user->syncRoles($name);
                }
            }

            return redirect()->route('admin.admin-users.index')->with('success', 'Admin User Created Successfully');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->route('admin.admin-users.index')->with('error', $e->getMessage());
        }
    }
    public function edit($id)
    {
        $user = AdminUser::findOrFail($id);
        $assignRoles = Roles::all();
        $userRoles = $user->roles->pluck('id')->toArray();
        return view('admin.admin_user.edit', compact('user', 'assignRoles', 'userRoles'));
    }
    public function update(Request $request, $id)
    {
        $user = AdminUser::findOrFail($id);

        // Validation
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:admin_users,email,' . $user->id,
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'fname'       => 'required|string|max:255',
            'lname'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'roles'       => 'required|array',
            'roles.*'     => 'exists:roles,name',
        ]);

        // Image folder
        $folderPath = public_path('uploads/admin_images');

        if (!File::exists($folderPath)) {
            File::makeDirectory($folderPath, 0777, true, true);
        }

        //  Image upload (replace old)
        if ($request->hasFile('image')) {

            // delete old image
            if ($user->image && File::exists(public_path($user->image))) {
                File::delete(public_path($user->image));
            }

            $image = $request->file('image');
            $fileName = time() . '_' . $image->getClientOriginalName();
            $image->move($folderPath, $fileName);

            $data['image'] = 'uploads/admin_images/' . $fileName;
        }

        // Update user
        $user->update([
            'username'    => $data['name'],
            'email'       => $data['email'],
            'fname'       => $data['fname'],
            'lname'       => $data['lname'],
            'description' => $data['description'] ?? null,
            'image'       => $data['image'] ?? $user->image,
        ]);

    
        //  Sync roles
        $user->syncRoles($data['roles']);

        return redirect()->route('admin.admin-users.index')
            ->with('success', 'Admin User Updated Successfully');
    }
}
