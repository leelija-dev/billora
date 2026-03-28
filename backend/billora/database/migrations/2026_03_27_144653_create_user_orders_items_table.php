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
        Schema::create('user_orders_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('customer_order_id');  //user_orders table order id 
            $table->string('order_id');     // this is for all shop continuous order id
            $table->unsignedBigInteger('product_id');
            $table->decimal('quantity', 12, 2)->default(0);
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('gst', 5, 2)->default(0);
            $table->decimal('discount', 5, 2)->default(0);
            $table->enum('status', ['pending','processing', 'ready_to_serve', 'completed'])->default('pending');
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_orders_items');
    }
};
