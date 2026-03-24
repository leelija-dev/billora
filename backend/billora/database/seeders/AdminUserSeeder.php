<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Hash;
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminUser::updateOrCreate(
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
        $this->command->info('Admin users created successfully!');
        $this->command->info('Super Admin - Email: admin@leelija.com, Password: admin123');
    }
}
