<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UltimoEscuchadoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->id_album) {
            
            return [
                'id' => $this->id_album,
                'nombre' => $this->album->nombre,
                'portada' => count($this->album->getMedia('*')) > 0 ? $this->album->getMedia('*')[0]->getUrl() : null,
                'artista' => $this->album->user->name,
                'tipo' => 'album',
                'ultima_reproduccion' => $this->ultima_reproduccion
            ];
        } else {
          
            return [
                'id' => $this->id_lista,
                'nombre' => $this->lista->nombre,
                'portada' => count($this->lista->getMedia('*')) > 0 ? $this->lista->getMedia('*')[0]->getUrl() : null,
                'creador' => $this->lista->user->name,
                'tipo' => 'lista',
                'ultima_reproduccion' => $this->ultima_reproduccion
            ];
        }
    }
}