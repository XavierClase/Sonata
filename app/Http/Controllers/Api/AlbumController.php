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
     * Recibir los datos de un álbum por su id.
     */
    public function show($idAlbum)
    {
        $album = Album::where('id', $idAlbum)->first();

        if (!$album) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }
        
        return new AlbumResource($album);
    }

    /**
     * Recibir todas las canciones pertenecientes al album introducido.
     */
    public function getCancionesAlbum(string $id)
    {
        $album = Album::findOrFail($id);
        $canciones = $album->canciones;
        
        return CancionResource::collection($canciones);
    }

    /**
     * Recibir los álbumes de un usuario artista en concreto (y los datos del usuario artista propietario).
     */
    public function getAlbumsArtista($userId)
    {
        $albumes = Album::with('user')->where('id_usuario', $userId)->get();

        return AlbumResource::collection($albumes); 
    }

    /**
     * Update the specified resource in storage.
     */


    public function updatePortada(Request $request, string $id)
    {
        $request->validate([
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            $album = Album::findOrFail($id);
            
            if ($album->id_usuario !== auth()->id()) {
                return response()->json([
                    'message' => 'No tienes permiso para editar este álbum'
                ], 403);
            }

            $album->clearMediaCollection('images/albums');
            
        
            $media = $album->addMediaFromRequest('portada')
                ->toMediaCollection('images/albums');

            return response()->json([
                'message' => 'Portada actualizada exitosamente',
                'portada_url' => $media->getUrl()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la portada',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:sencillo,ep,album', 
            'num_canciones' => 'required|integer|min:0',
            'duracion_total' => 'required|string', 
            'canciones' => 'nullable|string'
        ]);

        try {
            $album = Album::findOrFail($id);
            
            if ($album->id_usuario !== auth()->id()) {
                return response()->json([
                    'message' => 'No tienes permiso para editar este álbum'
                ], 403);
            }

        
            $duracionPartes = explode(':', $request->duracion_total);
            $duracionFormateada = '';
            
            if (count($duracionPartes) == 2) {
                $duracionFormateada = '00:' . str_pad($duracionPartes[0], 2, '0', STR_PAD_LEFT) . ':' . 
                                    str_pad($duracionPartes[1], 2, '0', STR_PAD_LEFT);
            } else if (count($duracionPartes) == 3) {
                $duracionFormateada = str_pad($duracionPartes[0], 2, '0', STR_PAD_LEFT) . ':' . 
                                    str_pad($duracionPartes[1], 2, '0', STR_PAD_LEFT) . ':' . 
                                    str_pad($duracionPartes[2], 2, '0', STR_PAD_LEFT);
            }

            $album->nombre = $request->nombre;
            $album->tipo = $request->tipo;
            $album->num_canciones = $request->num_canciones;
            $album->duracion_total = $duracionFormateada;
            $album->save();

        
            if ($request->has('canciones')) {
                $cancionesIds = json_decode($request->canciones, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                
                    $album->canciones()->sync($cancionesIds);
                }
            }

            return response()->json([
                'message' => 'Álbum actualizado exitosamente',
                'data' => new AlbumResource($album)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el álbum',
                'error' => $e->getMessage()
            ], 500);
        }
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

    public function obtenerAlbumsAleatorios()
    {
        $albumes = Album::with(['user', 'media'])
            ->get()
            ->shuffle()
            ->take(4);
        return AlbumResource::collection($albumes);
    }


    public function obtenerTodosLosAlbumes()
{
    $albumes = Album::with(['user', 'media'])->get(); 
    
    return AlbumResource::collection($albumes);
}
}