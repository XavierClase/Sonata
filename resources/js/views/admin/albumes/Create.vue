<template>
  <div class="">
    <div class="">
      <h2 class="">Crear Nuevo Álbum</h2>
    </div>
    <div class="">
      <form @submit.prevent="manejarSubmit" class="formulario_album">
        <div class="row mb-4">
          <div class="col-12 text-center mb-6">
            <div class="imagen_album " style="width: 200px; height: 200px;">
              <img :src="previewImagen || '/images/placeholder1.jpg'" class="" style="width: 100%; height: 100%; object-fit: cover;">
              <input type="file" @change="manejarImagen" accept="image/*" ref="archivoImagen" class="d-none">
              <button @click.prevent="$refs.archivoImagen.click()" class="btn btn-outline-primary mt-2  ">
                Seleccionar Portada
              </button>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="nombre">Nombre del álbum*</label>
              <input 
                type="text"
                id="nombre"
                v-model="albumData.nombre" 
                class="form-control" 
                placeholder="Nombre del álbum"
                maxlength="45"
                required
              />
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="tipo">Tipo*</label>
              <select 
                id="tipo"
                v-model="albumData.tipo" 
                class="form-select"
                required
              >
                <option value="album">Álbum</option>
                <option value="sencillo">Sencillo</option>
                <option value="ep">EP</option>
              </select>
            </div>
          </div>
          
          <div class="col-12">
            <div class="album_info mt-2">
              <p>Número de canciones: {{ canciones.length }}</p>
              <p>Duración total: {{ duracionTotalFormateada }}</p>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12">
            <h4>Canciones</h4>
            <div class="lista_canciones">
              <div v-if="canciones.length === 0" class="text-center py-3 text-muted">
                No hay canciones añadidas
              </div>
              <div v-for="(cancion, index) in canciones" :key="index" class="cancion border-bottom py-2 d-flex align-items-center">
                <span class="numero_cancion me-2">{{ index + 1 }}</span>
                <input v-model="cancion.nombre" placeholder="Nombre de la canción" class="form-control me-2" maxlength="45">
                <span class="duracion_cancion me-2">{{ cancion.duracion || '0:00' }}</span>
                <button @click.prevent="quitarCancion(index)" class="btn btn-sm btn-danger">⨯</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <input type="file" ref="archivoAudio" @change="manejarAudio" accept="audio/*" class="d-none" multiple>
            <button @click.prevent="$refs.archivoAudio.click()" class="btn btn-primary">
              Añadir canción
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="$router.push('/admin/albumes')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-success" :disabled="!esFormularioValido">
            Guardar Álbum
          </button>
        </div>
        
        <Toast />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAlbumes } from '@/composables/albumesAdmin.js';
import Toast from 'primevue/toast';

const toast = useToast();
const router = useRouter();
const { storeAlbum, loading, errors } = useAlbumes();

const archivoImagen = ref(null);
const archivoAudio = ref(null);
const previewImagen = ref(null);
const canciones = ref([]);

const albumData = reactive({
  nombre: '',
  tipo: 'album',
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
    if (previewImagen.value) {
      URL.revokeObjectURL(previewImagen.value);
    }
    albumData.portada = file;
    previewImagen.value = URL.createObjectURL(file);
    
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
      archivo: file,
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
    errores.forEach(error => {
      toast.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: error.mensaje,
        life: 3000
      });
    });
    return;
  }
  
  try {

    const albumFormData = new FormData();
    albumFormData.append('nombre', albumData.nombre);
    albumFormData.append('tipo', albumData.tipo);
    albumFormData.append('portada', albumData.portada);
    albumFormData.append('num_canciones', canciones.value.length.toString());
    albumFormData.append('duracion_total', duracionTotalFormateada.value);

    const albumResponse = await axios.post('/api/admin/albumes', albumFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    const albumId = albumResponse.data.album.id;
    

    for (let i = 0; i < canciones.value.length; i++) {
      const cancion = canciones.value[i];
      
      const cancionFormData = new FormData();
      cancionFormData.append('nombre', cancion.nombre);
      cancionFormData.append('duracion', cancion.duracion);
      cancionFormData.append('archivo', cancion.archivo);
      cancionFormData.append('album_id', albumId);
      cancionFormData.append('orden', (i + 1).toString());

      await axios.post('/api/canciones', cancionFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    
    toast.add({
      severity: 'success',
      summary: 'Álbum creado',
      detail: 'El álbum se ha creado exitosamente',
      life: 3000
    });
    

    router.push('/admin/albumes');
    
  } catch (error) {
    console.error('Error:', error.response?.data);
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: 'Ha ocurrido un error al crear el álbum',
      life: 3000
    });
  }
};
</script>