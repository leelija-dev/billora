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
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id(); 
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('fname');
            $table->string('lname');
            $table->string('address')->nullable();
            $table->string('image')->nullable();
            $table->string('description')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->integer('no_logon')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_users');
    }
};
