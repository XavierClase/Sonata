<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Http\Resources\CancionResource;
use Illuminate\Http\Request;
use App\Models\Album;

class AlbumController extends Controller
{
    /**
     * Recibir todos los albumes (y los datos del usuario artista propietario).
     */
    public function index()
    {
        $albumes = Album::with('user')->get();

        return response()->json($albumes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'num_canciones' => 'required|integer',
            'duracion_total' => 'required|string',
            'tipo' => 'required|string',
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            // Convertir el formato MM:SS a HH:MM:SS para MySQL TIME
            $duracionPartes = explode(':', $request->duracion_total);
            $duracionFormateada = '00:' . str_pad($duracionPartes[0], 2, '0', STR_PAD_LEFT) . ':' . 
                                str_pad(isset($duracionPartes[1]) ? $duracionPartes[1] : '00', 2, '0', STR_PAD_LEFT);

            $album = new Album([
                'nombre' => $request->nombre,
                'num_canciones' => $request->num_canciones,
                'duracion_total' => $duracionFormateada, // Formato 00:MM:SS para TIME
                'tipo' => $request->tipo
            ]);
            $album->id_usuario = auth()->id();
            $album->save();

            if ($request->hasFile('portada')) {
                $album->addMediaFromRequest('portada')
                    ->toMediaCollection('images/albums');
            }

            return response()->json([
                'message' => 'Álbum creado exitosamente',
                'album' => $album
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el álbum',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Recibir los álbumes de un usuario artista en concreto (y los datos del usuario artista propietario).
     */
    public function show($userId)
    {
        $albumes = Album::with('user')->where('id_usuario', $userId)->get();

        return AlbumResource::collection($albumes); 
    }

    public function getCancionesAlbum(string $id)
    {
        $album = Album::findOrFail($id);
        $canciones = $album->canciones;
        
        return CancionResource::collection($canciones);
    }

    public function getAlbumById($idAlbum)
    {
        $album = Album::where('id', $idAlbum)->first();

        if (!$album) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }
        
        return new AlbumResource($album);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $album = Album::findOrFail($id);
            
            if ($album->id_usuario !== auth()->id()) {
                return response()->json([
                    'message' => 'No tienes permiso para eliminar este álbum'
                ], 403);
            }
      
            foreach ($album->getMedia() as $media) {
                $media->delete();
            }
            
            $album->delete();

            return response()->json([
                'message' => 'Álbum eliminado correctamente'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el álbum',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}