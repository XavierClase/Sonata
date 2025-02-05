<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lista extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'portada',
        'duracion_total'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
    
}
