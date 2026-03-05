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
        Schema::create('bill_payment_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');     
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('store_id');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2);
            $table->decimal('due_amount', 12, 2)->default(0);
            $table->string('payment_method')->nullable(); 
            $table->string('transaction_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
       
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_payment_history');
    }
};
