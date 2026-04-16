<?php

namespace Database\Seeders;

use App\Models\CustomerSidebarPermission;
use Google\Service\CloudControlsPartnerService\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
class CustomerSiderbarPermission extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomerSidebarPermission::truncate();
        $permissions = [
               'Dashboard',
               'Products',
               'Categories',
               'Brands',
               'Units',
               'Medicine Types',
               'Stores',
               'Packages',
               'Stock',
               'Orders',
               'Customers',
               'Invoices',
               'Reports',
               'Plans',
               'Settings'

            
                   ];

        foreach ($permissions as $permission) {
            
            $slug = Str::slug($permission);
            CustomerSidebarPermission::create([
                'name' => $permission,
                'slug' => $slug,
                'status' => 1
            ]);
        }
    }
}
