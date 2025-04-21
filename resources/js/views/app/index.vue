<template>
  <div class="home-content">
    <div class="home-filas">
      <h2 id="recientes-titulo">Escuchado Recientemente</h2>
    <div class="home-fila">
      <div 
        v-for="item in ultimosEscuchados" 
        :key="`${item.tipo}-${item.id}`" 
        class="imagen_tarjeta cursor-pointer"
        @click="irADetalles(item)"
      >
        <img 
          :src="item.portada || 'images/placeholder.jpg'" 
          :alt="item.nombre" 
          class="imagen_caja"
        >
        <p class="titulos_album">{{ item.nombre }}</p>
        <p class="text-sm colorNombreArtista">{{ item.tipo === 'album' ? item.artista : item.creador }}</p>
      </div>
    </div>

    <h2>Descubre cosas nuevas</h2>

    <h3>Listas</h3>
    <div class="home-fila">
      <div 
        v-for="lista in randomListas" 
        :key="lista.id" 
        class="imagen_tarjeta cursor-pointer"
        @click="irADetallesLista(lista.id)"
      >
        <img 
          :src="lista.portada" 
          :alt="lista.nombre" 
          class="imagen_caja"
        >
        <p class="titulos_album">{{ lista.nombre }}</p>
        <p class="text-sm colorNombreArtista">{{ lista.creador }}</p>
      </div>
    </div>

    <h3>Álbums</h3>

    <div class="home-fila">
      <div 
        v-for="album in randomAlbums" 
        :key="album.id" 
        class="imagen_tarjeta cursor-pointer"
        @click="irADetallesAlbum(album.id)"
      >
        <img 
          :src="album.portada || 'images/placeholder.jpg'" 
          :alt="album.nombre" 
          class="imagen_caja"
        >
        <p class="titulos_album">{{ album.nombre }}</p>
        <p class="text-sm colorNombreArtista">{{ album.artista }}</p>
      </div>
    </div>

    <h3>Artistas</h3>

    <div class="home-fila">
      <div 
        v-for="artist in randomArtistas" 
        :key="artist.id" 
        class="imagen_tarjeta"
        @click="irAPerfilArtista(artist.id)"
      >
        <img 
          :src="artist.avatar || 'images/placeholder.jpg'" 
          :alt="artist.name" 
          class="imagen_caja artista_radius"
        >
        <p class="titulos_album">{{ artist.name }}</p>
      </div>
    </div>
    </div>
    
  </div>
  
</template>


<script setup>
import { onMounted } from 'vue';
import { useHome } from '@/composables/home.js';

const { 
  randomArtistas, 
  fetchRandomArtistas, 
  irAPerfilArtista, 
  randomAlbums, 
  fetchRandomAlbums, 
  irADetallesAlbum,
  randomListas,
  fetchRandomListas,
  irADetallesLista,
  irADetalles,
  ultimosEscuchados,
  fetchUltimosEscuchados
} = useHome(); 


onMounted(() => {
  fetchRandomArtistas();
  fetchRandomAlbums();
  fetchRandomListas();
  fetchUltimosEscuchados();
});
</script>

<style scoped>

#recientes-titulo {
  margin-top: 40px;
}

.colorNombreArtista{
  color: rgb(158, 158, 158);
}
.home-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
}

.home-filas {
  width: 85%;
  padding-bottom: 20px;
}
.home-fila {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  margin-left: 20px;
  padding-bottom: 45px;
}

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

h2 {
  background: linear-gradient(to right, #F472B6, #A855F7);
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-size: 30px;
  margin-bottom: 20px; 
  font-weight: bold;
}

h3 {
  color: #F472B6;
  margin-left: 15px;
}

p {
  color: white;
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
  min-width: 220px; 
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

@media (width < 500px) {
  .home-filas {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home-fila {
    justify-content: center;
  }
}

</style>