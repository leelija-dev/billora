<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->decimal('conversion_factor', 12, 4)->nullable()->after('unit_id');
            $table->decimal('minimum_stock_quantity', 12, 4)->default(0)->after('conversion_factor');
            $table->decimal('maximum_stock_quantity', 12, 4)->nullable()->after('minimum_stock_quantity');
            $table->decimal('current_stock', 12, 4)->default(0)->after('maximum_stock_quantity');//
            $table->decimal('mrp',12 ,2)->after("selling_price")->nullable();
            $table->decimal('wholesale_price',12 ,2)->after("mrp")->nullable();
            $table->decimal('gst_hsn_code',12 ,2)->after("gst_percentage")->nullable();//
            $table->decimal('discount_amount',12 ,2)->after("wholesale_price")->default(0);
    	    $table->decimal('cess_percentage',12 ,2)->after("discount_amount")->default(0);//
            $table->json('attributes')->nullable()->after('description')->comment('Size, color, flavor, strength, etc.'); //attributes JSON NULL COMMENT 'Size, color, flavor, strength, etc.',
            $table->enum('medicine_type', ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drop', 'inhaler', 'other'])->after('attributes')->nullable();
            $table->string('other_medicine_type')->after('medicine_type')->nullable();  // if user select other in medicine type then they can enter the medicine type in this column
            $table->date('expiry_date')->nullable()->after('other_medicine_type'); 
            $table->string('batch_number',100)->nullable()->after('expiry_date'); 
            $table->string('manufacturer_name',255)->nullable()->after('batch_number');
            $table->boolean('prescription_required')->default(false)->after('manufacturer_name'); // BOOLEAN DEFAULT FALSE,
            $table->string('schedule_type')->nullable()->after('prescription_required')->comment('H, X, G, etc.'); //schedule_type VARCHAR(20) NULL COMMENT 'H, X, G, etc.',
            $table->text('salt_composition')->nullable()->after('schedule_type')->comment('Active ingredients and their quantities'); //salt_composition TEXT NULL COMMENT 'Active ingredients and their quantities',
            $table->boolean('perishable')->default(false)->after('salt_composition')->comment('Requires cold storage'); //  'Requires cold storage',
            $table->boolean('organic_certified')->default(false)->after('perishable'); // organic_certified 
            $table->date('harvest_date')->nullable()->after('organic_certified'); // harvest_date DATE NULL,
            $table->text('storage_instructions')->nullable()->after('harvest_date');
            $table->text('short_description')->nullable()->after('storage_instructions'); //short_description VARCHAR(500) NULL
            $table->string('barcode', 100)->nullable()->after('qr_code'); // barcode
            $table->boolean('is_featured')->default(false)->after('is_active'); 
            $table->boolean('is_returnable')->default(true)->after('is_featured');
            $table->boolean('is_refundable')->default(true)->after('is_returnable');
            $table->integer('warranty_months')->default(0)->after('is_refundable');
            $table->string('warehouse_location', 100)->nullable()->after('warranty_months')->comment('Rack/shelf number');
            $table->unsignedBigInteger('supplier_id')->nullable()->after('warehouse_location');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
        });
    }

    /** 
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'conversion_factor',
                'minimum_stock_quantity',
                'maximum_stock_quantity',
                'current_stock',
                'mrp',
                'wholesale_price',
                'gst_hsn_code',
                'discount_amount',
                'cess_percentage',
                'attributes',
                'medicine_type',
                'other_medicine_type',
                'expiry_date',
                'batch_number',
                'manufacturer_name',
                'prescription_required',
                'schedule_type',
                'salt_composition',
                'perishable',
                'organic_certified',
                'harvest_date',
                'storage_instructions',
                'short_description',
                'barcode',
                'is_featured',
                'is_returnable',
                'is_refundable',
                'warranty_months',
                'warehouse_location',
                'supplier_id',
                'updated_by'
            ]);
        });
    }
};
