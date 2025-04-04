<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class Album extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;
    protected $table = 'albums';
    protected $fillable = [
        'nombre',
        'num_canciones',
        'duracion_total',
        'tipo',
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
    
    public function usuariosQueLaTienenComoFavorita()
    {
        return $this->belongsToMany(User::class, 'albumes_favoritos', 'id_album', 'id_usuario')
            ->withTimestamps();
    }


    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('albums')
            ->useFallbackUrl('/images/placeholder.jpg')
            ->useFallbackPath(public_path('/images/placeholder.jpg'));
    }

    
}
