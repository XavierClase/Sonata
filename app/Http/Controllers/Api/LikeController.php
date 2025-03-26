<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CancionFavorita;
use Auth;

class LikeController extends Controller
{

    public function cancionesFavoritas()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        return response()->json([
            'favoritos' => $user->cancionesFavoritas()->pluck('canciones.id') 
        ]);
    }


    public function toggleLikeCancion($id_cancion)
    {
        $user = Auth::user(); 
        
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
        
        $user->cancionesFavoritas()->toggle($id_cancion);

        
        return response()->json([
            'success' => true,
            'message' => 'Like actualizado correctamente',
            'favoritos' => $user->cancionesFavoritas()->pluck('id') 
        ]);
    }

    public function toggleLikeAlbum($id_album)
    {
        $user = Auth::user(); 
        
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
        
        $user->albumesFavoritos()->toggle($id_album);

        
        return response()->json([
            'success' => true,
            'message' => 'Like actualizado correctamente',
            'favoritos' => $user->albumesFavoritos()->pluck('id') 
        ]);
    }

    public function esAlbumFavorito($id_album)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $esFavorito = $user->albumesFavoritos()->where('albums.id', $id_album)->exists();

        return response()->json([
            'es_favorito' => $esFavorito
        ]);
    }


}
