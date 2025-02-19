<template>
  <section class="layout">
    <div class="appPanel">
      <app-panel></app-panel>
    </div>
    <section class="contenidoUpload">
      <div class="maximo-contenido">
        <h1 class="titulo_subir_musica">Subir Música</h1>
        <form @submit.prevent="submitForm" class="formulario_album">
          <div class="header_formulario">
            <!-- para añadir imagen falta retocar para que avise al propio artista que puede añadir -->
            <div class="imagen_album">
              <img 
                :src="PreviewImagen  || '/placeholder-image.png'" 
                class="estilo_imagen"
              >
              <input 
                type="file" 
                @change="handleImageUpload" 
                accept="image/*"
                ref="archivo"
                class="añadir_archivo"
              >
            </div>
   
            <div class="informacion_album">
              <input 
                v-model="albumData.nombre" 
                placeholder="Nombre álbum" 
                class="inputs_form"
              >
              <p class="nombre_artista">Artista: {{ user?.name }}</p>
              <select v-model="albumData.tipo" class="select_form">
                <option value="Album">Álbum</option>
                <option value="Sencillo">Sencillo</option>
                <option value="Ep">EP</option>
              </select>
            </div>
          </div>

          <!--falta añadir numero de canciones y duracion total del album -->
          <section class="lista_canciones">
            <div  class="cancion">
              <span class="numero_cancion"></span>
              <input placeholder="Nombre de la canción" class="input_cancion">
              <span class="duracion_cancion"></span>
              <button 
                @click.prevent="removeSong(index)" 
                class="quitar_cancion"
              >⨯</button>
            </div>
          </section>

          <!--boton para añadir las canciones falta por hacar-->
          <button class="cancion_boton">Añadir canción</button>

          <button type="submit" class="boton_confirmar">Confirmar</button>
        </form>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { authStore } from "@/store/auth.js";
import AppPanel from '@/layouts/AppPanel.vue';
import axios from 'axios';

const user = authStore().user;
const archivo = ref(null);
const PreviewImagen = ref(null);
const songs = ref([]);

const albumData = reactive({
  nombre: '',
  tipo: 'Album',
  portada: null
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    albumData.portada = file;
    PreviewImagen.value = URL.createObjectURL(file);
  }
};


//de momento tan solo se ha podido añadir la imagen de la portada al album 
// y se envia a la base de datos, no funciona ahora porque falta que se puedan añadir archivos

const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append('nombre', albumData.nombre);
    formData.append('tipo', albumData.tipo);
    
    
    if (albumData.portada) {
      formData.append('portada', albumData.portada);
    }
    
    formData.append('num_canciones', songs.value.length.toString());
    formData.append('duracion_total', '0:00');

    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.post('/api/artista', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    console.log('Respuesta:', response.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data);
  }
};

</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
}

.appPanel {
  margin-top: 20px;
  position: fixed;
  width: 300px;
  height: calc(100vh - 9rem);
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 4.5rem;
  left: 1rem;
  padding: 0.5rem 1.5rem;
  border-right: 2px solid #f472b5;
  border-image: linear-gradient(to bottom, #f472b5, #A855F7) 1;
}

.contenidoUpload {
  margin-left: 330px;
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.maximo-contenido {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo_subir_musica {
  background: linear-gradient(to right, #F472B6, #A855F7);
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-size: 48px;
  margin-bottom: 40px;
  text-align: center;
}

.formulario_album {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.header_formulario {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
}

.imagen_album {
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed #f472b5;
  overflow: hidden;
  flex-shrink: 0;
}

.estilo_imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.añadir_archivo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.informacion_album {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.inputs_form, .select_form {
  padding: 12px;
  border: 1px solid #f472b5;
  border-radius: 6px;
  background: transparent;
  color: #e854a0;
  width: 100%;
  font-size: 16px;
}

.nombre_artista {
  color: white;
  margin: 15px 0;
  font-size: 16px;
}

.lista_canciones {
  margin: 30px 0;
  width: 100%;
}

.cancion {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  color: white;
}

.numero_cancion {
  width: 40px;
  text-align: right;
  font-size: 16px;
}

.input_cancion {
  flex: 1;
  padding: 12px;
  border: 1px solid #f472b5;
  border-radius: 6px;
  background: transparent;
  color: white;
  font-size: 16px;
}

.duracion_cancion {
  width: 70px;
  text-align: right;
  font-size: 16px;
}

.quitar_cancion {
  background: none;
  border: none;
  color: #f472b5;
  cursor: pointer;
  font-size: 24px;
  padding: 0 10px;
}

.cancion_boton {
  width: 100%;
  padding: 18px;
  background: rgba(244, 114, 182, 0.1);
  border: 1px solid #f472b5;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  margin: 30px 0;
  font-size: 16px;
}

.boton_confirmar {
  width: 100%;
  padding: 18px;
  background: linear-gradient(to right, #F472B6, #A855F7);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}


</style>