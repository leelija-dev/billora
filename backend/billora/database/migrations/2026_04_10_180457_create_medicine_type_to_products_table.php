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
             
            $table->unsignedBigInteger('medicine_type')->nullable()->change();
            $table->renameColumn('medicine_type', 'medicine_type_id');
            $table->dropColumn('other_medicine_type');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('other_medicine_type')->nullable();
            $table->renameColumn('medicine_type_id', 'medicine_type');
            $table->enum('medicine_type', ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drop', 'inhaler', 'other'])->after('attributes')->nullable()->change();;
        });
    }
};
