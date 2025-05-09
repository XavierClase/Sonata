<template>
  <section class="layout">
    <div class="appPanel">
      <app-panel></app-panel>
    </div>
    <section class="contenidoUpload">
      <div class="maximo-contenido">
        <h1 class="titulo_subir_musica">Subir Música</h1>
        <form @submit.prevent="manejarSubmit" class="formulario_album">
          <div class="header_formulario">
            <div class="imagen_album">
              <img :src="PreviewImagen || '/images/placeholder1.jpg'" class="estilo_imagen">
              <input type="file" @change="manejarImagen" accept="image/*" ref="archivoImagen" class="añadir_archivo">  
         
            </div>

            <div class="informacion_album">
              <input v-model="albumData.nombre" placeholder="Nombre álbum" class="inputs_form" maxlength="45">
           
              <select v-model="albumData.tipo" class="select_form">
                <option value="Album">Álbum</option>
                <option value="Sencillo">Sencillo</option>
                <option value="EP">EP</option>
              </select>
            
              <div class="album_info">
                <p>Número de canciones: {{ canciones.length }}</p>
                <p>Duración total: {{ duracionTotalFormateada }}</p>
              </div>
            </div>
          </div>

          <section class="lista_canciones">
            <div v-for="(cancion, index) in canciones" :key="index" class="cancion">
              <span class="numero_cancion">{{ index + 1 }}</span>
              <input v-model="cancion.nombre" placeholder="Nombre de la canción" class="input_cancion" maxlength="45">
              <span class="duracion_cancion">{{ cancion.duracion || '0:00' }}</span>
              <button @click.prevent="quitarCancion(index)" class="quitar_cancion">⨯</button>
            </div>
          </section>

          <div class="acciones_canciones">
            <input type="file" ref="archivoAudio" @change="manejarAudio" accept="audio/*" class="hidden" multiple>
            <button @click.prevent="$refs.archivoAudio.click()" class="cancion_boton">
              Añadir canción
            </button>
          </div>

          <button type="submit" class="boton_confirmar">
            Confirmar
          </button>

          <Toast  group="validacion" />
        </form>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { authStore } from "@/store/auth.js";
import AppPanel from '@/layouts/AppPanel.vue';
import { useToast } from 'primevue/usetoast';
import { useFuncionesArtista } from '@/composables/funcionesArtista';

const toast = useToast();
const user = authStore().user;
const archivoImagen = ref(null);
const archivoAudio = ref(null);
const PreviewImagen = ref(null);
const canciones = ref([]);
const { cargando, error, subirAlbumCompleto } = useFuncionesArtista();

const albumData = reactive({
  nombre: '',
  tipo: 'Album',
  portada: null
});

const obtenerDuracionAudio = (file) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;

    audio.addEventListener('loadedmetadata', () => {
      const duracion = Math.floor(audio.duration);
      const minutos = Math.floor(duracion / 60);
      const segundos = duracion % 60;
      URL.revokeObjectURL(objectUrl); 
      audio.remove(); 
      resolve(`${minutos}:${segundos.toString().padStart(2, '0')}`);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      audio.remove();
      resolve('0:00');
    });
  });
};

const manejarImagen = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (PreviewImagen.value) {
      URL.revokeObjectURL(PreviewImagen.value);
    }
    albumData.portada = file;
    PreviewImagen.value = URL.createObjectURL(file);
    
    toast.add({
      severity: 'info',
      summary: 'Portada seleccionada',
      detail: 'Imagen de portada añadida correctamente',
      life: 3000
    });
  }
};

const manejarAudio = async (event) => {
  const files = Array.from(event.target.files);
  
  if (files.length === 0) return;

  for (const file of files) {
    const duracion = await obtenerDuracionAudio(file);
    canciones.value.push({  
      nombre: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      duracion
    });
  }
  
  toast.add({
    severity: 'success',
    summary: 'Canciones añadidas',
    detail: `${files.length} canción(es) agregadas`,
    life: 3000
  });
  event.target.value = '';
};

const borrarTodo = () => {
  albumData.nombre = '';
  albumData.tipo = 'Album';
  albumData.portada = null;
  PreviewImagen.value = null;
  canciones.value = [];
  
  if (archivoImagen.value) archivoImagen.value.value = '';
  if (archivoAudio.value) archivoAudio.value.value = '';
};

const quitarCancion = (index) => {
  canciones.value.splice(index, 1);
  toast.add({
    severity: 'success',
    summary: 'Canción eliminada',
    detail: 'La canción fue removida del álbum',
    life: 3000
  });
};

const calcularDuracionTotal = () => {
  return canciones.value.reduce((total, cancion) => {
    const [min, sec] = cancion.duracion.split(':').map(Number);
    return total + (min * 60) + sec;
  }, 0);
};

const formatearDuracionTotal = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const segsRestantes = segundos % 60;
  return `${minutos}:${segsRestantes.toString().padStart(2, '0')}`;
};

const duracionTotalFormateada = computed(() => {
  return formatearDuracionTotal(calcularDuracionTotal());
});

const esFormularioValido = computed(() => {
  return albumData.nombre &&
    albumData.portada &&
    canciones.value.length > 0 &&
    canciones.value.every(c => c.nombre);
});

const validarFormulario = () => {
  let errores = [];
  
  if (!albumData.nombre) {
    errores.push({
      campo: 'nombre',
      mensaje: 'Falta añadir el nombre del álbum'
    });
  }
  
  if (!albumData.portada) {
    errores.push({
      campo: 'portada',
      mensaje: 'Falta añadir la portada del álbum'
    });
  }
  
  if (canciones.value.length === 0) {
    errores.push({
      campo: 'canciones',
      mensaje: 'Debe añadir al menos una canción'
    });
  } else {
    const cancionesSinNombre = canciones.value.filter(c => !c.nombre);
    if (cancionesSinNombre.length > 0) {
      errores.push({
        campo: 'nombreCanciones',
        mensaje: `${cancionesSinNombre.length} canción(es) sin nombre`
      });
    }
  }
  
  return errores;
};

const manejarSubmit = async () => {
  const errores = validarFormulario();
  
  if (errores.length > 0) {
    toast.removeGroup('validacion');
    
    errores.forEach(error => {
      toast.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: error.mensaje,
        life: 5000,
        group: 'validacion' 
      });
    });
    return;
  }
  
  enviarFormulario();
};

const enviarFormulario = async () => {
  try {
    await subirAlbumCompleto(
      {
        nombre: albumData.nombre,
        tipo: albumData.tipo,
        portada: albumData.portada,
        duracionTotal: duracionTotalFormateada.value
      },
      canciones.value
    );
    
    toast.add({
      severity: 'success',
      summary: 'Álbum creado',
      detail: 'El álbum se ha creado exitosamente',
      life: 5000
    });
    borrarTodo();
    
  } catch (error) {
    console.error('Error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: 'Ha ocurrido un error al crear el álbum',
      life: 5000
    });
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

.inputs_form,
.select_form {
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

.album_info {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #f472b5;
  border-radius: 6px;
  color: white;
}

.album_info p {
  margin: 5px 0;
  font-size: 14px;
}

.hidden {
  display: none;
}

@media (width < 500px) {
  .layout {
    flex-direction: column;
    padding-bottom: 100px;
  }
  
  .appPanel {
    position: relative;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    margin: 0;
    border-right: none;
    border-bottom: 2px solid #f472b5;
    border-image: linear-gradient(to right, #f472b5, #A855F7) 1;
    padding: 10px;
    overflow-x: auto;
    z-index: 1;
  }
  
  .contenidoUpload {
    margin-left: 0;
    margin-top: 20px;
    padding: 15px;
  }
  
  .titulo_subir_musica {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .header_formulario {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .imagen_album {
    width: 150px;
    height: 150px;
  }
  
  .cancion {
    flex-wrap: wrap;
  }
  
  .numero_cancion {
    width: 30px;
    font-size: 14px;
  }
  
  .input_cancion {
    flex: 1;
    min-width: 150px;
  }
  
  .duracion_cancion {
    width: 50px;
    font-size: 14px;
  }
}
</style>