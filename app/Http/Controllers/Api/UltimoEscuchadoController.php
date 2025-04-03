<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ultimo_escuchado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UltimoEscuchadoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        
        // Obtener los últimos 4 elementos escuchados por el usuario, ordenados por fecha
        $ultimosItems = Ultimo_escuchado::where('id_usuario', $userId)
            ->with(['album', 'lista']) // Cargar relaciones
            ->orderBy('ultima_reproduccion', 'desc')
            ->take(4)
            ->get()
            ->map(function ($item) {
                if ($item->id_album) {
                    return [
                        'id' => $item->id_album,
                        'nombre' => $item->album->nombre,
                        'portada' => $item->album->portada,
                        'artista' => $item->album->user->name,
                        'tipo' => 'album'
                    ];
                } else {
                    return [
                        'id' => $item->id_lista,
                        'nombre' => $item->lista->nombre,
                        'portada' => $item->lista->portada,
                        'creador' => $item->lista->user->name,
                        'tipo' => 'lista'
                    ];
                }
            });
            
        return response()->json(['data' => $ultimosItems]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'id_album' => 'nullable|exists:albums,id',
            'id_lista' => 'nullable|exists:listas,id',
        ]);
        
        if (!$request->filled('id_album') && !$request->filled('id_lista')) {
            return response()->json(['error' => 'Debe proporcionar un ID de álbum o lista'], 422);
        }
        
        $userId = Auth::id();
        
        // Buscar o crear el registro
        Ultimo_escuchado::updateOrCreate(
            [
                'id_usuario' => $userId,
                'id_album' => $request->input('id_album'),
                'id_lista' => $request->input('id_lista'),
            ],
            [
                'ultima_reproduccion' => now()
            ]
        );
        
        return response()->json(['message' => 'Último escuchado registrado correctamente']);
    }
}