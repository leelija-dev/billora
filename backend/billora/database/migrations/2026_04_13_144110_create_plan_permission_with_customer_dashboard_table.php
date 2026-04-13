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
        Schema::create('plan_permission_with_customer_dashboard', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_permission_id');
            $table->unsignedBigInteger('customer_sidebar_permission_id');
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_permission_with_customer_dashboard');
    }
};
