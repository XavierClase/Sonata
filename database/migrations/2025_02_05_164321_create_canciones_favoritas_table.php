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
        Schema::create('canciones_favoritas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_cancion');
            $table->unsignedBigInteger('id_usuario');
            $table->timestamps();
        
            
            $table->foreign('id_cancion')->references('id')->on('canciones')->cascadeOnDelete();
            $table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('canciones_favoritas');
    }
};
