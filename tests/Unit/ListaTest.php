<?php

namespace Tests\Unit;

use App\Models\Cancion;
use App\Models\Lista;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListaTest extends TestCase
{
    use RefreshDatabase;

    protected function createTestUser()
    {
        $user = new User();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        $user->password = bcrypt('password');
        $user->save();
        return $user;
    }

    protected function createTestLista($userId)
    {
        $lista = new Lista();
        $lista->nombre = 'Test Lista';
        $lista->descripcion = 'Test descripcion';
        $lista->duracion_total = '00:00:00';
        $lista->num_canciones = 0;
        $lista->id_usuario = $userId;
        $lista->save();
        return $lista;
    }

    protected function createTestCancion($userId)
    {
        $cancion = new Cancion();
        $cancion->nombre = 'Test Cancion';
        $cancion->duracion = '00:03:00';
        $cancion->reproducciones = 0;
        $cancion->archivo = 'ruta/del/archivo.mp3'; // Simula un archivo
        $cancion->id_usuario = $userId;
        $cancion->save();
        return $cancion;
    }

    /** @test */
    public function una_lista_pertenece_a_un_usuario()
    {
        $user = $this->createTestUser();
        $lista = $this->createTestLista($user->id);

        $this->assertInstanceOf(User::class, $lista->user);
        $this->assertEquals($user->id, $lista->user->id);
    }

    /** @test */
    public function puede_crear_una_lista()
    {
        $user = $this->createTestUser();
        
        $lista = new Lista();
        $lista->nombre = 'Nueva Lista';
        $lista->descripcion = 'Una lista para testear la creación';
        $lista->duracion_total = '00:00:00';
        $lista->num_canciones = 0;
        $lista->id_usuario = $user->id;
        $lista->save();
        
        $this->assertDatabaseHas('listas', [
            'nombre' => 'Nueva Lista',
            'descripcion' => 'Una lista para testear la creación',
            'id_usuario' => $user->id
        ]);
    }

    /** @test */
    public function puede_modificar_una_lista()
    {
        $user = $this->createTestUser();
        $lista = $this->createTestLista($user->id);
        
        // Modify the lista
        $lista->nombre = 'Nombre Actualizado';
        $lista->descripcion = 'Descripción actualizada';
        $lista->save();
        
        $this->assertDatabaseHas('listas', [
            'id' => $lista->id,
            'nombre' => 'Nombre Actualizado',
            'descripcion' => 'Descripción actualizada'
        ]);
    }

    /** @test */
    public function puede_eliminar_una_lista()
    {
        $user = $this->createTestUser();
        $lista = $this->createTestLista($user->id);
        
        // Remember the ID before deletion
        $listaId = $lista->id;
        
        // Delete the lista
        $lista->delete();
        
        $this->assertDatabaseMissing('listas', [
            'id' => $listaId
        ]);
    }

}
