<template>
  <div class="contenedor_sonata">
    <div class="contenedor">
      <section class="section">
        <h2 class="titulo_seccion_ultimo">Último escuchado</h2>
        <div class="imagenes_contenedor">
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="The new abnormal" class="imagen_caja">
            <p class="titulos_album ">The new abnormal</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Yo, minoría absoluta" class="imagen_caja ">
            <p class="titulos_album ">Yo, minoría absoluta</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Mi lista #1" class="imagen_caja ">
            <p class="titulos_album ">Mi lista #1</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Louder than bombs" class="imagen_caja ">
            <p class="titulos_album ">Louder than bombs</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="titulo_seccion">Otras listas</h2>
        <div class="imagenes_contenedor">
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Recopilación jazz" class="imagen_caja ">
            <p class="titulos_album ">Recopilación jazz</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Música para entrenar" class="imagen_caja ">
            <p class="titulos_album ">Música para entrenar</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Canciones cine kinki" class="imagen_caja ">
            <p class="titulos_album ">Canciones cine kinki</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Chill" class="imagen_caja ">
            <p class="titulos_album ">Chill</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="titulo_seccion">Otros álbumes</h2>
        <div class="imagenes_contenedor">
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Alcalá Norte" class="imagen_caja ">
            <p class="titulos_album ">Alcalá Norte</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Artaud" class="imagen_caja ">
            <p class="titulos_album ">Artaud</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Sistema de entretenimiento" class="imagen_caja ">
            <p class="titulos_album ">Sistema de entretenimiento</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Inadaptados" class="imagen_caja ">
            <p class="titulos_album ">Inadaptados</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="titulo_seccion">Otros artistas</h2>
        <div class="imagenes_contenedor">
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="La Banda Trapera Del Río" class="imagen_caja  artista_radius">
            <p class="titulos_album ">La Banda Trapera Del Río</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="La Plata" class="imagen_caja  artista_radius">
            <p class="titulos_album ">La Plata</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="Gorillaz" class="imagen_caja artista_radius">
            <p class="titulos_album ">Gorillaz</p>
          </div>
          <div class="imagen_tarjeta">
            <img src="images/placeholder.jpg" alt="BRUX" class="imagen_caja  artista_radius">
            <p class="titulos_album ">BRUX</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>


<script>

</script>

<style scoped>
.contenedor_sonata {
  color: white;
  padding: 25px; 
  min-height: 100vh;

}

.contenedor {
  max-width: 1100px; 
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.section {
  margin-bottom: 45px; 
}

.titulo_seccion {
  background: linear-gradient(to right, #F472B6, #A855F7);
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-size: 30px;
  margin-bottom: 20px; 
  font-weight: normal;
}


.titulo_seccion_ultimo {
  background: linear-gradient(to right, #F472B6, #A855F7);
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-size: 30px;
  margin-bottom: 20px; 
  font-weight: bold;
}

.imagenes_contenedor {
  display: flex;
  flex-wrap: wrap;
  gap: 60px; 
  
}


.imagen_tarjeta {
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 220px; 
}

.imagen_tarjeta:hover {
  transform: scale(1.05);
}

.imagen_caja {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}


.artista_radius {
  border-radius: 50%;
}

.titulos_album {
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>