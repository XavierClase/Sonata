<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\UserResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, InteractsWithMedia;

    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    public function albums()
    {
        return $this->hasMany(Album::class, 'id_usuario');
    }

    public function listas()
    {
        return $this->hasMany(Lista::class, 'id_usuario');
    }

    public function canciones()
    {
        return $this->hasMany(Cancion::class, 'id_usuario');
    }

    public function cancionesFavoritas()
    {
        return $this->belongsToMany(Cancion::class, 'canciones_favoritas', 'id_usuario', 'id_cancion')
            ->withTimestamps();
    }

    public function albumesFavoritos()
    {
        return $this->belongsToMany(Album::class, 'albumes_favoritos', 'id_usuario', 'id_album')
            ->withTimestamps();
    }

    public function listasFavoritas()
    {
        return $this->belongsToMany(Lista::class, 'listas_favoritas', 'id_usuario', 'id_lista')
            ->withTimestamps();
    }
    


    
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new UserResetPasswordNotification($token));
    }

    public function assignaments()
    {
        return $this->hasMany(UserAssignment::class,'user_id');
    }


    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images/users')
            ->useFallbackUrl('/images/placeholder.jpg')
            ->useFallbackPath(public_path('/images/placeholder.jpg'));
    }

    public function registerMediaConversions(Media $media = null): void
    {
        if (env('RESIZE_IMAGE') === true) {

            $this->addMediaConversion('resized-image')
                ->width(env('IMAGE_WIDTH', 300))
                ->height(env('IMAGE_HEIGHT', 300));
        }
    }
}
