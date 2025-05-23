<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role_id' => $this->roles,
            'roles' => $this->roles,
            'rolNombre' => $this->roles->pluck('name'),
            'avatar' => $this->getFirstMediaUrl('images-users'),
            'fotoDetalles' => $this->getFirstMediaUrl('images-users-detalles'),
            'descripcion' => $this->descripcion,
            'created_at' => $this->created_at->toDateString()
        ];
    }
}
