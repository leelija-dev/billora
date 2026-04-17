<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class PlanPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions =[
            [
                'permission_name' => 'Stock Management',
                'description' => 'Manage stock, inventory and products',
            ],
            [
                'permission_name' => 'Bill Generation',
                'description' => 'Generate and manage bills/invoices',
            ],
        ];
        DB::table('plan_permission')->truncate();
        foreach ($permissions as $permission) {
            DB::table('plan_permission')->updateOrInsert(
                ['slug' => Str::slug($permission['permission_name'])],
                [
                    'permission_name' => $permission['permission_name'],
                    'description' => $permission['description'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
