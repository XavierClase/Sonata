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


    public function lista_favorita()
    {
        return $this->belongsToMany(lista_favorita::class, 'id_lista');
    }

    public function detalle_lista()
    {
        return $this->belongsTo(detalle_lista::class, 'id_lista');
    }
    
}
