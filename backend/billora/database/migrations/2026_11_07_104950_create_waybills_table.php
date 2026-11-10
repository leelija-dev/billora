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
        Schema::create('waybills', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('waybill_number')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->date('waybill_date')->nullable();
 
            // Consignor (sender)
            $table->string('store_name', 150);
            $table->text('store_address')->nullable();
            $table->string('store_gstin', 15)->nullable();
            $table->string('store_phone', 20)->nullable();
 
            // Consignee (receiver)
            $table->string('customer_name', 150);
            $table->text('customer_address')->nullable();
            $table->string('customer_pincode', 10)->nullable();
            $table->string('customer_gstin', 20)->nullable();
            $table->string('customer_phone', 20)->nullable();
 
            // Route
            $table->string('origin_city', 80)->nullable();
            $table->string('origin_pincode', 10)->nullable();
            $table->string('destination_city', 80)->nullable();
            $table->string('destination_pincode', 10)->nullable();
 
            // Transport
            $table->string('vehicle_number', 20)->nullable();
            $table->string('transport_mode', 10)->default('road'); // road, rail, air, ship
 
            // Totals & charges
            $table->unsignedInteger('total_packages')->default(0);
            $table->decimal('total_weight', 12, 3)->default(0);
            $table->decimal('total_value', 14, 2)->default(0);
            $table->decimal('freight_amount', 12, 2)->default(0);
            $table->decimal('other_charges', 12, 2)->default(0);
 
            // Status & compliance
            $table->string('status', 20)->nullable(); // draft, issued, in_transit, delivered, cancelled
            $table->timestamp('delivered_at')->nullable();
            $table->string('invoice_qr', 255)->nullable();
            $table->string('invoice_public_id', 255)->nullable();
            $table->string('waybill_qr', 255)->nullable();
            $table->string('waybill_public_id', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waybill');
    }
};
