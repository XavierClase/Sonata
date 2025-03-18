<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Lista extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'nombre',
        'descripcion',
        'duracion_total'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function detalle_lista()
    {
        return $this->belongsTo(detalle_lista::class, 'id_lista');
    }

    public function canciones()
    {
        return $this->belongsToMany(Cancion::class, 'detalles_listas', 'id_lista', 'id_cancion')
                    ->withPivot('orden')
                    ->orderBy('detalles_listas.orden');
    }
    
    public function favorito()
    {
        return $this->belongsToMany(User::class);
    }
    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('listas')
            ->useFallbackUrl('/images/placeholder.jpg')
            ->useFallbackPath(public_path('/images/placeholder.jpg'));
    }
}
