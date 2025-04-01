<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListaResource;
use App\Http\Resources\CancionResource;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use App\Models\Lista;

class ListaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'nullable|string',
            'duracion_total' => 'required|string',
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {

            $lista = new Lista([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,  
                'duracion_total' => $request->duracion_total, 
            ]);
            
            $lista->id_usuario = auth()->id();
            $lista->save();

            if ($request->hasFile('portada')) {
                $lista->addMediaFromRequest('portada')
                    ->toMediaCollection('images/listas');
            }

            return response()->json([
                'message' => 'Lista creada exitosamente',
                'lista' => $lista
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la lista',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recibe los datos de la lista seleccionada.
     */
    public function show($idLista)
    {
        $lista = Lista::where('id', $idLista)->first();

        if (!$lista) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }
        
        return new ListaResource($lista);
    }

    /**
     * Recibir todas las canciones pertenecientes a la lista introducida.
     */
    public function getCancionesLista(string $id)
    {
        $lista = Lista::findOrFail($id);
        $canciones = $lista->canciones;
        
        return CancionResource::collection($canciones);
    }


    public function añadirCancionALista(Request $request)
    {
        $request->validate([
            'lista_ids' => 'required|array',
            'lista_ids.*' => 'exists:listas,id',
            'cancion_id' => 'required|exists:canciones,id'
        ]);
    
        $exitosas = [];
        $duplicados = [];
    
        foreach ($request->lista_ids as $listaId) {
            $lista = Lista::find($listaId);
          
            if ($lista->canciones()->where('id_cancion', $request->cancion_id)->exists()) {
                $duplicados[] = $listaId;
                continue;
            }
    
          
            $orden = $lista->canciones()->count() + 1;
            $lista->canciones()->attach($request->cancion_id, ['orden' => $orden]);
            $this->actualizarDuracionLista($lista);
            $exitosas[] = $listaId;
        }
    
        return response()->json([
            'message' => 'Operación completada',
            'exitosas' => $exitosas,
            'duplicados' => $duplicados
        ], 200);
    }

    public function actualizarDuracionLista(Lista $lista)
    {
        
        $lista->num_canciones = $lista->canciones()->count();
        
       
        $duracionTotal = $lista->canciones->sum(function ($cancion) {
            $partes = explode(':', $cancion->duracion);
            
            if (count($partes) === 3) {
                return ($partes[0] * 3600) + ($partes[1] * 60) + $partes[2];
            }
            
            if (count($partes) === 2) { 
                return ($partes[0] * 60) + $partes[1];
            }
            
            return $partes[0];
        });
    
        $horas = floor($duracionTotal / 3600);
        $minutos = floor(($duracionTotal % 3600) / 60);
        $segundos = $duracionTotal % 60;
    
        $lista->duracion_total = sprintf('%02d:%02d:%02d', $horas, $minutos, $segundos);
        $lista->save();
    }

    /**
     * Recibir las listas de el usuario iniciado.
     */
    public function getListasUser($userId)
    {
    $listas = Lista::with('canciones')
        ->where('id_usuario', $userId)
        ->get();

    return ListaResource::collection($listas);
    }   

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lista = Lista::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        if (auth()->id() !== $lista->id_usuario) {
            return response()->json(['message' => 'No tienes permiso para actualizar esta lista'], 403);
        }

        $lista->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
        ]);

        return new ListaResource($lista);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $lista = Lista::findOrFail($id);
            
            if ($lista->id_usuario !== auth()->id()) {
                return response()->json([
                    'message' => 'No tienes permiso para eliminar esta lista'
                ], 403);
            }
      
            foreach ($lista->getMedia() as $media) {
                $media->delete();
            }
            
            $lista->delete();

            return response()->json([
                'message' => 'Lista eliminada correctamente'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la lista',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateimg(Request $request)
    {
        $lista = Lista::find($request->id);

        if($request->hasFile('picture')) {
            $lista->media()->delete();
            $media = $lista->addMediaFromRequest('picture')->preservingOriginal()->toMediaCollection('images/listas');
        }
        $lista =  Lista::with('media')->find($request->id);
        return  $lista;
    }

    public function eliminarCancionDeLista($lista_id, $cancion_id)
    {
        try {
            $lista = Lista::findOrFail($lista_id);

            if ($lista->id_usuario !== auth()->id()) {
                return response()->json([
                    'message' => 'No tienes permiso para modificar esta lista'
                ], 403);
            }

            // Eliminar la canción de la lista
            $lista->canciones()->detach($cancion_id);

            // Actualizar la duración total y el número de canciones
            $this->actualizarDuracionLista($lista);

            return response()->json([
                'message' => 'Canción eliminada correctamente de la lista'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la canción de la lista',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function obtenerListasAleatorias()
    {
        $listas = Lista::with(['user', 'media'])
            ->get()
            ->shuffle()
            ->take(4);

            
        return ListaResource::collection($listas);
    }


}
