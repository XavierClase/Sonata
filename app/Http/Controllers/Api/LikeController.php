<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Http\Resources\CancionResource;
use App\Http\Resources\ListaResource;
use Illuminate\Http\Request;
use Auth;

class LikeController extends Controller
{

    public function getAlbumesFavoritos()
    {
        $user = Auth::user();

        $albumesFavoritos = $user->albumesFavoritos()
            ->with(['user', 'media']) 
            ->get();

        return AlbumResource::collection($albumesFavoritos);
    }

    public function getListasFavoritas()
    {
        $user = Auth::user();

        $listasFavoritas = $user->listasFavoritas()
            ->with(['user', 'media']) 
            ->get();

        return ListaResource::collection($listasFavoritas);
    }


    public function getCancionesFavoritas()
    {
        $user = Auth::user();
    
        // Cargamos las relaciones necesarias para el Resource
        $cancionesFavoritas = $user->cancionesFavoritas()
            ->with(['user', 'albums.media']) // Precargamos relaciones necesarias
            ->get();
        
        return CancionResource::collection($cancionesFavoritas);

    }

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

    public function toggleLikeLista($id_lista)
    {
        $user = Auth::user(); 
        
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
        
        $user->listasFavoritas()->toggle($id_lista);

        
        return response()->json([
            'success' => true,
            'message' => 'Like actualizado correctamente',
            'favoritos' => $user->albumesFavoritos()->pluck('id') 
        ]);
    }

    public function esListaFavorita($id_lista)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $esFavorito = $user->listasFavoritas()->where('listas.id', $id_lista)->exists();

        return response()->json([
            'es_favorito' => $esFavorito
        ]);
    }


}
