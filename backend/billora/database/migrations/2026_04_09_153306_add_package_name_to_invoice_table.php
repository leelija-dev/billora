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
        Schema::table('invoice', function (Blueprint $table) {
            $table->string('package_name')->nullable()->after('status');
            $table->decimal('package_price', 10, 2)->nullable()->after('package_name');
            $table->string('package_size')->nullable()->after('package_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('-invoice', function (Blueprint $table) {
            $table->dropColumn('package_name');
            $table->dropColumn('package_price');
            $table->dropColumn('package_size');
        });
    }
};
