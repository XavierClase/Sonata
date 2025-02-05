<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class albums extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'num_canciones',
        'duracion_total',
        'tipo',
        'portada'
    ];
}
