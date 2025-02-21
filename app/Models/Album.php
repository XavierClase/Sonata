<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class Album extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'nombre',
        'num_canciones',
        'duracion_total',
        'tipo',
        'portada',
        'id_usuario'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function canciones()
{
    return $this->belongsToMany(Cancion::class, 'detalles_albums', 'id_album', 'id_cancion')
                ->withPivot('orden')
                ->orderBy('detalles_albums.orden');
}

    
    
    
    public function favorito()
    {
        return $this->belongsToMany(User::class);
    }


    
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images/albums')
            ->useFallbackUrl('/images/placeholder.jpg') 
            ->useFallbackPath(public_path('/images/placeholder.jpg'));
    }

    
}
