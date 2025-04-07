<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ultimo_escuchado;
use App\Http\Resources\UltimoEscuchadoResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UltimoEscuchadoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        
      
        $ultimosItems = Ultimo_escuchado::where('id_usuario', $userId)
            ->with(['album.user', 'lista.user']) 
            ->orderBy('ultima_reproduccion', 'desc')
            ->take(4)
            ->get();
            
        return UltimoEscuchadoResource::collection($ultimosItems);
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