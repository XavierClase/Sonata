<template>
    <div class="">
      <div class="">
        <h2 class="">Editar Álbum</h2>
      </div>
      <div class="">
        <form @submit.prevent="manejarSubmit" class="formulario_album" v-if="!loading && albumCargado">
          <div class="row mb-4">
            <div class="col-12 text-center mb-6">
              <div class="imagen_album " style="width: 200px; height: 200px;">
                <img :src="previewImagen || (album && album.portada_url) || '/images/placeholder1.jpg'" class="" style="width: 100%; height: 100%; object-fit: cover;">
                <input type="file" @change="manejarImagen" accept="image/*" ref="archivoImagen" class="d-none">
                <button @click.prevent="$refs.archivoImagen.click()" class="btn btn-outline-primary mt-2">
                  Cambiar Portada
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
                  maxlength="100"
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
                <div v-for="(cancion, index) in canciones" :key="cancion.id || index" class="cancion border-bottom py-2 d-flex align-items-center">
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
            <button type="submit" class="btn btn-success" :disabled="!esFormularioValido || loading">
              Guardar Cambios
            </button>
          </div>
          
          <Toast />
        </form>
        <div v-else-if="loading" class="text-center p-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando datos del álbum...</p>
        </div>
        <div v-else class="alert alert-danger">
          No se pudo cargar la información del álbum
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useToast } from 'primevue/usetoast';
  import { useAlbumes } from '@/composables/albumesAdmin.js';
  import axios from 'axios';
  import Toast from 'primevue/toast';
  
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const { getAlbum, updateAlbum, loading: albumLoading, errors } = useAlbumes();
  
  const albumId = route.params.id;
  const album = ref(null);
  const albumCargado = ref(false);
  const loading = ref(true);
  const archivoImagen = ref(null);
  const archivoAudio = ref(null);
  const previewImagen = ref(null);
  const canciones = ref([]);
  const cancionesOriginales = ref([]);
  const cancionesEliminadas = ref([]);
  const nuevasPortada = ref(false);
  
  const albumData = reactive({
    nombre: '',
    tipo: 'album',
    portada: null,
    num_canciones: 0,
    duracion_total: '0:00'
  });
  

  onMounted(async () => {
  try {
    loading.value = true;
    
    const response = await axios.get(`/api/admin/albumes/${albumId}`);
    if (!response.data || !response.data.data) {
      throw new Error("Datos de álbum no encontrados");
    }
    
    const respData = response.data.data;
    album.value = respData;
  
    albumData.nombre = respData.nombre;
    albumData.tipo = respData.tipo || 'album';
    
 
    if (respData.portada) {
   
      album.value.portada_url = respData.portada;
    }

    const cancionesResponse = await axios.get(`/api/albumes/${albumId}/canciones`);
    if (cancionesResponse.data && cancionesResponse.data.data) {
      const cancionesData = cancionesResponse.data.data;
      
      canciones.value = cancionesData.map(c => ({
        id: c.id,
        nombre: c.nombre,
        duracion: c.duracion || '0:00',
        archivo: null,
        esExistente: true
      }));
      
      cancionesOriginales.value = JSON.parse(JSON.stringify(canciones.value));
    }
    
    albumCargado.value = true;
    loading.value = false;
    
  } catch (error) {
    console.error('Error al cargar datos del álbum:', error);
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Error de carga',
      detail: 'No se pudo cargar la información del álbum',
      life: 3000
    });
  }
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
      nuevasPortada.value = true;
      
      toast.add({
        severity: 'info',
        summary: 'Portada seleccionada',
        detail: 'Nueva imagen de portada añadida',
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
        duracion,
        esExistente: false
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
    const cancion = canciones.value[index];
    

    if (cancion.id && cancion.esExistente) {
      cancionesEliminadas.value.push(cancion.id);
    }
    
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
      if (!cancion.duracion) return total;
      const partes = cancion.duracion.split(':').map(Number);
      const min = partes[0] || 0;
      const sec = partes[1] || 0;
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
    
    if (canciones.value.length === 0) {
      errores.push({
        campo: 'canciones',
        mensaje: 'Debe haber al menos una canción'
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
  
  const actualizarCancionesExistentes = async () => {
    const cancionesModificadas = canciones.value.filter(c => c.esExistente && c.id);
    
    for (const cancion of cancionesModificadas) {
  
      const original = cancionesOriginales.value.find(c => c.id === cancion.id);
      if (original && original.nombre !== cancion.nombre) {
        try {
          await axios.put(`/api/canciones/${cancion.id}`, {
            nombre: cancion.nombre,
            duracion: cancion.duracion
          });
        } catch (error) {
          console.error(`Error al actualizar canción ${cancion.id}:`, error);
          throw error;
        }
      }
    }
  };
  
  const eliminarCanciones = async () => {
    for (const cancionId of cancionesEliminadas.value) {
      try {
        await axios.delete(`/api/canciones/${cancionId}`);
      } catch (error) {
        console.error(`Error al eliminar canción ${cancionId}:`, error);
        throw error;
      }
    }
  };
  
  const subirNuevasCanciones = async () => {
    const nuevasCanciones = canciones.value.filter(c => !c.esExistente);
    
    for (let i = 0; i < nuevasCanciones.length; i++) {
      const cancion = nuevasCanciones[i];
      
      const cancionFormData = new FormData();
      cancionFormData.append('nombre', cancion.nombre);
      cancionFormData.append('duracion', cancion.duracion);
      cancionFormData.append('archivo', cancion.archivo);
      cancionFormData.append('album_id', albumId);
      cancionFormData.append('orden', (canciones.value.indexOf(cancion) + 1).toString());
  
      try {
        await axios.post('/api/canciones', cancionFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } catch (error) {
        console.error(`Error al subir nueva canción:`, error);
        throw error;
      }
    }
  };
  
  const actualizarPortada = async () => {
    if (nuevasPortada.value && albumData.portada) {
      try {
        const portadaFormData = new FormData();
        portadaFormData.append('portada', albumData.portada);
        
        await axios.post(`/api/albumes/${albumId}/portada`, portadaFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } catch (error) {
        console.error('Error al actualizar portada:', error);
        throw error;
      }
    }
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
      loading.value = true;
      
    
      const albumFormData = {
        nombre: albumData.nombre,
        tipo: albumData.tipo,
        num_canciones: canciones.value.length.toString(),
        duracion_total: duracionTotalFormateada.value
      };
  
    
      await axios.put(`/api/albumes/${albumId}`, albumFormData);
      
 
      if (nuevasPortada.value) {
        await actualizarPortada();
      }
        await actualizarCancionesExistentes();
      
      
      await eliminarCanciones();
      
  
      await subirNuevasCanciones();
      
      loading.value = false;
      
      toast.add({
        severity: 'success',
        summary: 'Álbum actualizado',
        detail: 'El álbum se ha actualizado exitosamente',
        life: 3000
      });
      
      router.push('/admin/albumes');
      
    } catch (error) {
      loading.value = false;
      console.error('Error general:', error.response?.data);
      toast.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: 'Ha ocurrido un error al actualizar el álbum',
        life: 3000
      });
    }
  };
  </script>