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
        Schema::create('seller_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('seller_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('stock_id')->nullable();
            $table->string('qty')->nullable();
            $table->decimal('purchase_price',12,2)->default(0);
            $table->decimal('gst_percentage',5,2)->default(0);
            $table->decimal('total_amount',12,2)->default(0); // total bill amount
            $table->decimal('paid_amount',12,2)->default(0);
            $table->string('invoice_number')->nullable(); //  Invoice number provided by the seller ,not our system invoice ID
            $table->string('invoice_date')->nullable();
            $table->string('invoice_image')->nullable();
            $table->string('invoice_image_public_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_products');
    }
};
