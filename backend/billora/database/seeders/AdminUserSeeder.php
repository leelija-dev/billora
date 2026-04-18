<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminUser;
use App\Models\Roles;
use App\Models\SuperAdminPermission;
use Spatie\Permission\Models\Permission; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         AdminUser::truncate();
        $admin = AdminUser::updateOrCreate(
            ['username' => 'admin'], // condition
            [
                'email' => 'admin@leelija.com',
                'password' => Hash::make('admin123'),
                'fname' => 'Admin',
                'lname' => 'User',
                'address' => '123 admin street',
                'image' => 'default.jpg',
            ]
        );
        Roles::truncate();
        $role = Roles::firstOrCreate([
            'name' => 'superadmin',
            'guard_name' => 'admin'
        ]);
        $permissions = [
            'view dashboard',
            'view customers',
            'create customers',
            'edit customers',
            'delete customers',
            'view plans',
            'create plans',
            'edit plans',
            'delete plans',
            'view plan permissions',
            'create plan permissions',
            'edit plan permissions',
            'delete plan permissions',
            'view plan purchase history',
            'delete plan purchase history',
            'view mail history',
            'delete mail history',
            'view admin users',
            'create admin users',
            'edit admin users',
            'delete admin users',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
        ];
            Permission::truncate();
         foreach ($permissions as $perm) {
            Permission::Create([
                'name' => $perm,
                'guard_name' => 'admin'
            ]);
        }
        $permissions = Permission::all();
        $role->syncPermissions($permissions);   // assign permissions to role
        $admin->assignRole($role);   // assign role to user
        $this->command->info('Admin users created successfully!');
        $this->command->info('Super Admin - Email: admin@leelija.com, Password: admin123');
    }
}
