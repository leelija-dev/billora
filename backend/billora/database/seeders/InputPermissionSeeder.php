<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InputPermission;
use Illuminate\Support\Str;

class InputPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         InputPermission::truncate();
        $permissions = [
            //Clothes/Apparel Fields    
            'size',
            'color',
            'material',
            'gender',
            'attributes',
            //Grocery/Perishable Fields
            'perishable',
            'organic certified',
            'harvest date',
            'storage instructions',
            //Medicine/Pharmacy Fields
            'medicine type Id',

            'expiry date',
            'batch number',
            'manufacturer name',
            'prescription required',
            'schedule type',
            'salt composition',
            //electronics
            'warranty months',
            'gst hsn code'

        ];
        foreach($permissions as $permission){
            InputPermission::create([
                'name' => $permission,
                'slug' => Str::slug($permission),
                'created_by' =>'admin'
            ]);
        }
    }
}
