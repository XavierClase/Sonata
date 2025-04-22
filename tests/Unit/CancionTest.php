<?php

namespace Tests\Feature\Api;

use App\Models\Cancion;
use App\Models\Album;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class CancionTest extends TestCase
{
    
    
    private $user;
    private $album;
    private $cancion;
    
    protected function setUp(): void
    {
        parent::setUp();
        
       
        $this->user = User::first();
        
      
        if (!$this->user) {
            $this->user = User::create([
                'name' => 'Usuario Test',
                'email' => 'test_'.time().'@example.com',
                'password' => bcrypt('password'),
            ]);
        }
        
  
        $this->album = Album::first();
        if (!$this->album) {
            $this->album = Album::create([
                'nombre' => 'Álbum de prueba',
                'anio' => '2025',
                'id_usuario' => $this->user->id,
                'num_canciones' => 0,
                'duracion_total' => '00:00:00' 
            ]);
        }
        
       
        Sanctum::actingAs($this->user);
    }
    
    protected function tearDown(): void
    {
      
        if (isset($this->cancion) && !is_null($this->cancion)) {
            try {
              
                $this->cancion->albums()->detach();
                
              
                $this->cancion->clearMediaCollection('audio/canciones');
                
              
                $this->cancion->delete();
            } catch (\Exception $e) {
       
            }
        }
        
        parent::tearDown();
    }
    
   
   
    
    /** @test */
    public function puede_crear_una_cancion()
    {
        Storage::fake('public');
        
        $audioFile = UploadedFile::fake()->create('cancion.mp3', 100);
        
        $response = $this->postJson('/api/canciones', [
            'nombre' => 'Canción de prueba',
            'duracion' => '3:45',
            'archivo' => $audioFile,
            'album_id' => $this->album->id,
            'orden' => 1
        ]);
        
        $response->assertStatus(201)
                 ->assertJsonPath('message', 'Canción creada y asociada exitosamente');
        
    
        $this->cancion = Cancion::find($response->json('cancion.id'));
    }
    
   
   
    /** @test */
    public function puede_actualizar_una_cancion()
    {
       
        $this->cancion = Cancion::create([
            'nombre' => 'Canción original',
            'duracion' => '00:02:30',
            'reproducciones' => 0,
            'id_usuario' => $this->user->id
        ]);
        
        // Asociar al álbum
        $this->album->canciones()->attach($this->cancion->id, ['orden' => 1]);
        
        $response = $this->putJson("/api/canciones/{$this->cancion->id}", [
            'nombre' => 'Canción actualizada',
            'duracion' => '2:45',
            'album_id' => $this->album->id,
            'orden' => 2
        ]);
        
        $response->assertStatus(200);
        
        $this->cancion->refresh();
        $this->assertEquals('Canción actualizada', $this->cancion->nombre);
    }
    
    /** @test */
    public function puede_eliminar_una_cancion()
    {
        
        $this->cancion = Cancion::create([
            'nombre' => 'Canción para eliminar',
            'duracion' => '00:02:30',
            'reproducciones' => 0,
            'id_usuario' => $this->user->id
        ]);
        
      
        $this->album->canciones()->attach($this->cancion->id, ['orden' => 1]);
        
        $cancionId = $this->cancion->id;
        
        $response = $this->deleteJson("/api/canciones/{$cancionId}");
        
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Canción eliminada completamente del sistema']);
        
        
        $this->assertNull(Cancion::find($cancionId));
        
       
        $this->cancion = null;
    }
    
    /** @test */
    
    
    /** @test */
    public function puede_obtener_canciones_populares_de_usuario()
    {
        
        $canciones = [];
        for ($i = 1; $i <= 3; $i++) {
            $cancion = Cancion::create([
                'nombre' => "Canción popular $i",
                'duracion' => '00:02:30',
                'reproducciones' => $i * 10,
                'id_usuario' => $this->user->id
            ]);
            $canciones[] = $cancion;
        }
        
        $response = $this->getJson("/api/canciones/populares/{$this->user->id}");
        
        $response->assertStatus(200);
        
 
        foreach ($canciones as $cancion) {
            $cancion->delete();
        }
    }
    
    /** @test */
    public function validacion_falla_al_crear_cancion_sin_datos_requeridos()
    {
        $response = $this->postJson('/api/canciones', [
          
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['nombre', 'duracion', 'archivo', 'album_id', 'orden']);
    }
}