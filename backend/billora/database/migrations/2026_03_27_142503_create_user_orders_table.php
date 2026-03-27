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
        Schema::create('user_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('order_id');               // this is for all shop continuous order id
            $table->bigInteger('store_id')->nullable();
            $table->integer('total_items')->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->enum('order_status', ['pending','processing', 'ready_to_serve', 'completed'])->default('pending');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('order_by')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_orders');
    }
};
