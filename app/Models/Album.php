<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'num_canciones',
        'duracion_total',
        'tipo',
        'portada'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
