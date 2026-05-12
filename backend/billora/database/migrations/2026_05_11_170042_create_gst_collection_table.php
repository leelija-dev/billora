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
        Schema::create('gst_collection', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('product_id');
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('purchase_gst_percentage',5,2)->default(0);
            $table->decimal('purchase_gst_amount', 12, 2)->default(0);
            $table->decimal('selling_price', 12, 2)->default(0);
            $table->decimal('selling_discount_percentage', 5, 2)->default(0);
            $table->decimal('selling_gst_percentage', 5, 2)->default(0);
            $table->decimal('selling_gst_amount', 12, 2)->default(0);
            $table->decimal('quantity', 12, 2)->default(0);
            $table->boolean('govt_pay_status')->default(false);
            $table->string('invoice_status')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gst_collection');
    }
};
