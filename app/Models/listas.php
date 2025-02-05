<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class listas extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'portada',
        'duracion_total'
    ];

    
}
