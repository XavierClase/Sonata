<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Http\Resources\ListaResource;
use App\Http\Resources\UserResource;
use App\Models\Album;
use App\Models\Lista;
use App\Models\User;
use Illuminate\Http\Request;

class BuscarController extends Controller
{
    /**
     * Buscar álbumes, listas y artistas según un término de búsqueda
     */
    public function buscar(Request $request)
    {
        $query = $request->input('query');
        
        // Validar que la consulta tenga al menos 3 caracteres
        if (!$query || strlen($query) < 3) {
            return response()->json([
                'albums' => [],
                'listaReproduccion' => [],
                'usuario' => [],
            ]);
        }
        
        // Limitar a 5 resultados por categoría para la vista previa
        $limit = $request->input('limit', 5);
        
        // Buscar álbumes que coincidan con la consulta
        $albums = Album::where('nombre', 'like', "%{$query}%")
            ->with('user')
            ->limit($limit)
            ->get();
        
        // Buscar listas que coincidan con la consulta
        $listas = Lista::where('nombre', 'like', "%{$query}%")
            ->withCount('canciones')
            ->limit($limit)
            ->get();
        
        // Buscar artistas que coincidan con la consulta
        $users = User::with('roles')  
        ->where(function($q) use ($query) {
            $q->where('name', 'like', "%{$query}%");
        })
        ->limit($limit)
        ->get();
        
        return response()->json([
            'albums' => AlbumResource::collection($albums),
            'listaReproduccion' => ListaResource::collection($listas),
            'usuario' => UserResource::collection($users),
        ]);
    }
}