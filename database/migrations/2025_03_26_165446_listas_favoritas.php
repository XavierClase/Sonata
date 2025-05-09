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
        Schema::create('listas_favoritas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_lista');
            $table->unsignedBigInteger('id_usuario');
            $table->timestamps();
        
            
            $table->foreign('id_lista')->references('id')->on('listas')->cascadeOnDelete();
            $table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albumes_favoritos');
    }
};
