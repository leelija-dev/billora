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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('invoice_id');
            $table->bigInteger('product_id');
            $table->decimal('quantity', 10, 2)->default(0); // Quantity like 10kg
            $table->integer('item_count');  //example:toal items is 2 per item 5 kg
            $table->integer('unit_id')->nullable(); // kg,ml etc.
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('gst', 5, 2)->default(0);
            $table->decimal('discount', 5, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);
            $table->string('status')->default('draft');
            $table->integer('created_by')->nullable();
            $table->timestamps();
        });
          
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
