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
        Schema::create('detalles_listas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_lista');
            $table->foreign('id_lista')->references('id')->on('listas')->cascadeOnDelete();

            $table->unsignedBigInteger('id_cancion');
            $table->foreign('id_cancion')->references('id')->on('canciones')->cascadeOnDelete();

            $table->integer('orden');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_listas');
    }
};
