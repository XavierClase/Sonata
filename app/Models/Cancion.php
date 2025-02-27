<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Cancion extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'canciones';

    protected $fillable = [
       'nombre',
       'reproducciones',
       'duracion',
       'archivo',
       'id_usuario'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function detalle_lista()
    {
        return $this->belongsToMany(detalle_lista::class, 'id_cancion');
    }
    
    public function albums()
    {
        return $this->belongsToMany(Album::class, 'detalles_albums', 'id_cancion', 'id_album')
                    ->withPivot('orden');
    }
    

    public function favorito()
    {
        return $this->belongsToMany(User::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('canciones')
            ->useFallbackUrl('/audio/placeholder.mp3')
            ->useFallbackPath(public_path('/audio/placeholder.mp3'));
    }

    public function getDuracionFormateadaAttribute()
    {
        $partes = explode(':', $this->duracion);
        if (count($partes) >= 3) {
            return $partes[1] . ':' . $partes[2];
        }
        return $this->duracion;
    }


}
