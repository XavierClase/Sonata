<template>
  <div class="show"></div>
  <div class="show2"></div>
  <section class="layout">
    <div class="appPanel">
      <app-panel></app-panel>
    </div>
    <section class="contenido_edit">
      <h1 class="titulo_albums">Tus Álbums</h1>
      <h2 class="color_texto">Selecciona álbum:</h2>

      <div v-if="cargando" class="cargando">
        <p class="color_texto">Cargando álbumes...</p>
      </div>

      <div v-else-if="error" class="error">
        <p class="color_texto">{{ error }}</p>
      </div>

      <div v-else-if="albums.length === 0" class="sin_albums">
        <p class="color_texto">No tienes álbumes creados aún.</p>
        <button class="crear_album_boton" @click="irACrearElAlbum">Crear nuevo álbum</button>
      </div>

      <div v-else class="album_caja">
        <div v-for="album in albums" :key="album.id" class="albums_items">
          <div class="album_portada">
            <img :src="conseguirImagenURL(album)" alt="Portada del álbum">
          </div>
          <div class="informacion_album ">
            <div class="nombre_album">
              <p class="nombre_album_texto">{{ album.nombre }}</p>
              <div class="album-actions">
                <button class="boton_editar" @click.stop="editarAlbum(album)">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="boton_borrar" @click.stop="confirmDeleteAlbum(album)">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
            <div class="detalle_album ">
              <p class="tipo_album">{{ album.tipo }}</p>
              <p class="album_Ncancion">{{ album.num_canciones }} canciones</p>
              <p class="duracion_album">{{ formatTotalDuration(album.duracion_total) }}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog class="dialog_estilo" v-model:visible="MostrarPopupEditar" modal header="Editar Álbum" appendTo=".show">
        <div class="row">
          <div class="config_imagenes col-md-6">
            <div class="imagen_config_perfil" @dragover="manejarArrasterSobreLaImagen" @dragleave="manejarArrastreSalirImagen"
              @drop="manejarSoltarImagen" :class="{ 'drag-over': arrastrarImagenAlbum }">
              <img :src="imagenPreview || '/images/placeholder.jpg'" class="estilo_imagen">
              <div v-if="arrastrarImagenAlbum">
                <p>Suelta para cambiar la imagen</p>
              </div>
              <input type="file" @change="handleImageChange" accept="image/jpeg,image/png,image/jpg,image/gif"
                class="añadir_archivo">
            </div>
            <p class="text-sm text-center ">Arrastra una imagen para cambiar la portada del álbum</p>
          </div>
          <div class="col-md-6">
            <div class="flex items-center gap-4 mb-4">
              <FloatLabel variant="on">
                <InputText class="dialog_input" id="albumNombre" v-model="selectedAlbum.nombre" maxlength="45" />
                <label for="albumNombre">Nombre del álbum</label>
              </FloatLabel>
            </div>
            <div class="flex items-center gap-4 mb-4">
              <FloatLabel variant="on">
                <Dropdown class="dialog_input" id="albumTipo" v-model="selectedAlbum.tipo" :options="albumTipos"
                  optionLabel="label" optionValue="value"  :style="{ color: 'white' }"  />
                <label for="albumTipo">Tipo</label>
              </FloatLabel>
            </div>

            <div class="resumen_album mt-4">
              <div class="resumen_caja">
                <div class="resumen_label"><i class="pi pi-list"></i> Canciones:</div>
                <div>{{ albumCanciones.length }}</div>
              </div>
              <div class="resumen_caja">
                <div><i class="pi pi-clock"></i> Duración total:</div>
                <div>{{ calculateTotalDuration() }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="album-songs-section mt-6" @dragover="manejarArrasterSobreLaCancion" @dragleave="manejarArrastreSalirCancion"
          @drop="manejarSoltarCancion" :class="{ 'drag-over': arrastarAreaCanciones }">
          <h3 class="songs-title">Canciones del álbum</h3>
          <div v-if="albumCanciones.length === 0" class="sin_canciones">
            <p>Este álbum no tiene canciones.</p>
            <p class="text-sm mt-2">Arrastra archivos de audio aquí para añadirlos al álbum</p>
          </div>
          <div v-else class="songs-list">
          <div v-for="(song, index) in albumCanciones" :key="index" class="song-item">
            <div class="song-info">
              <p class="song-number">{{ index + 1 }}</p>
              <div class="song-name-edit">
                <InputText v-model="song.nombre" class="song-name-input" @blur="actualizarNombreCancion(song)" placeholder="Nombre de la canción" />
              </div>
              <p class="song-duration"><i class="pi pi-clock"></i> {{ formatDuration(song.duracion) }}</p>
            </div>
            <div class="song-actions">
              <Button icon="pi pi-trash" class="p-button-rounded boton_eliminar" @click="removeSong(song)"></Button>
            </div>
          </div>
        </div>
          <div class="añadir_Canciones_Seccion mt-4">
            <h4>Añadir canciones</h4>
            <div class="add-songs-controls">
              <div class="flex items-center gap-4 mb-4">
                <p class="text-sm">arrastra archivos de audio aquí</p>
              </div>
              <Button label="Añadir canción" icon="pi pi-plus" @click="addSongToAlbum"></Button>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" label="Cancelar" class="boton_cancelar" @click="MostrarPopupEditar = false"></Button>
          <Button type="button" label="Guardar" @click="saveAlbumChanges"></Button>
        </div>
      </Dialog>
      <Dialog v-model:visible="MostrarConfirmacionEliminar" modal header="Confirmar eliminación" class="dialog_estilo" appendTo=".show2">
        <p>¿Estás seguro de que quieres eliminar el álbum "{{ selectedAlbum?.nombre }}"?</p>
        <p class="text-red-500">Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" label="Cancelar" class="boton_cancelar"
            @click="MostrarConfirmacionEliminar = false"></Button>
          <Button type="button" label="Eliminar" class="boton_eliminar" @click="deleteAlbum"></Button>
        </div>
      </Dialog>
      <Toast />
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from "@/store/auth.js";
import AppPanel from '@/layouts/AppPanel.vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useFuncionesArtista } from '@/composables/funcionesArtista';

const router = useRouter();
const toast = useToast();
const user = authStore().user;
const {
  albums,
  cargando,
  error,
  getAlbumesUsuario,
  getCancionesAlbum,
  eliminarAlbum,
  eliminarCancion,
  agregarCancion,
  actualizarPortadaAlbum,
  actualizarAlbum
} = useFuncionesArtista();

const MostrarPopupEditar = ref(false);
const MostrarConfirmacionEliminar = ref(false);
const selectedAlbum = ref(null);
const imagenPreview = ref(null);
const imagenArchivo = ref(null);
const albumCanciones = ref([]);
const arrastrarImagenAlbum = ref(false);
const arrastarAreaCanciones = ref(false);
const CancionesPendientes = ref([]);
const cancionesOriginales = ref([]);

const albumTipos = [
  { label: 'Álbum', value: 'album' },
  { label: 'EP', value: 'ep' },
  { label: 'Sencillo', value: 'sencillo' }
];

const actualizarNombreCancion = (cancion) => {
  if (!cancion.nombre || cancion.nombre.trim() === '') {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'El nombre de la canción no puede estar vacío', 
      life: 3000 
    });
    const original = cancionesOriginales.value.find(c => c.id === cancion.id);
    if (original) {
      cancion.nombre = original.nombre;
    } else {
      cancion.nombre = "Sin título";
    }
    return;
  }
  if (cancion.isNew) {
    const pendiente = CancionesPendientes.value.find(c => c.id === cancion.id);
    if (pendiente) {
      pendiente.nombre = cancion.nombre;
    }
    return;
  }

  if (!cancion.nombreModificado) {
    cancion.nombreModificado = true;
  }
};

const manejarArrasterSobreLaImagen = (event) => {
  event.preventDefault();
  arrastrarImagenAlbum.value = true;
};

const manejarArrastreSalirImagen = () => {
  arrastrarImagenAlbum.value = false;
};

const manejarSoltarImagen = (event) => {
  event.preventDefault();
  arrastrarImagenAlbum.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    imagenArchivo.value = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imagenPreview.value = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
};

const manejarArrasterSobreLaCancion = (event) => {
  event.preventDefault();
  arrastarAreaCanciones.value = true;
};

const manejarArrastreSalirCancion = () => {
  arrastarAreaCanciones.value = false;
};

const manejarSoltarCancion = (event) => {
  event.preventDefault();
  arrastarAreaCanciones.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const audioFiles = Array.from(files).filter(file =>
      file.type.startsWith('audio/') ||
      file.name.endsWith('.mp3') ||
      file.name.endsWith('.wav') ||
      file.name.endsWith('.ogg') ||
      file.name.endsWith('.flac')
    );
    if (audioFiles.length > 0) {
      processAudioFiles(audioFiles);
    }
  }
};

const cargarAlbums = async () => {
  await getAlbumesUsuario(user.id);
};

function conseguirImagenURL(album) {
  let image = album.portada;
  return new URL(image, import.meta.url).href;
}

const editarAlbum = async (album) => {
  selectedAlbum.value = { 
    id: album.id,
    nombre: album.nombre || '',
    tipo: album.tipo || 'album',
    num_canciones: album.num_canciones || 0,
    duracion_total: album.duracion_total || '00:00',
    portada: album.portada
  };
  
  console.log("Album seleccionado para editar:", selectedAlbum.value);
  
  imagenPreview.value = conseguirImagenURL(album);
  await cargarCancionesAlbum(album.id);
  MostrarPopupEditar.value = true;
};

const cargarCancionesAlbum = async (albumId) => {
  try {
    albumCanciones.value = await getCancionesAlbum(albumId);
    cancionesOriginales.value = JSON.parse(JSON.stringify(albumCanciones.value));
  } catch (err) {
    albumCanciones.value = [];
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar canciones del álbum', life: 3000 });
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagenArchivo.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagenPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const formatDuration = (duration) => {
  if (!duration) return '00:00';
  if (typeof duration === 'string') {
    const timeParts = duration.split('T');
    if (timeParts.length > 1) {
      const timeString = timeParts[1].split('.')[0];
      const parts = timeString.split(':');
      if (parts[0] === '00') {
        return `${parts[1]}:${parts[2]}`;
      }
      return timeString;
    }
    const parts = duration.split(':');
    if (parts.length === 3 && parts[0] === '00') {
      return `${parts[1]}:${parts[2]}`;
    }
    return duration;
  }
  return '00:00';
};

const formatTotalDuration = (totalDuration) => {
  if (!totalDuration) return '00:00';
  return formatDuration(totalDuration);
};

const calculateTotalDuration = () => {
  if (albumCanciones.value.length === 0) return '00:00:00';

  let totalSeconds = 0;
  albumCanciones.value.forEach(song => {
    if (song.duracion) {
      const parts = song.duracion.split(':');
      if (parts.length === 3) {
        totalSeconds += parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
      } else if (parts.length === 2) {
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    }
  });
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const addSongToAlbum = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/*';
  input.multiple = true;
  input.onchange = (event) => {
    processAudioFiles(event.target.files);
  };
  input.click();
};

const processAudioFiles = (files) => {
  Array.from(files).forEach(file => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const tempId = 'new_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      const newSong = {
        id: tempId,
        nombre: file.name.replace(/\.[^/.]+$/, ""),
        duracion: formattedDuration,
        file: file,
        isNew: true
      };
      CancionesPendientes.value.push(newSong);
      albumCanciones.value.push(newSong);
    };
  });
};

const removeSong = (song) => {
  albumCanciones.value = albumCanciones.value.filter(s => s.id !== song.id);
 
  if (song.isNew) {
    CancionesPendientes.value = CancionesPendientes.value.filter(s => s.id !== song.id);
  }
  toast.add({ severity: 'info', summary: 'Canción eliminada', detail: 'La canción ha sido eliminada del álbum', life: 3000 });
};

const confirmDeleteAlbum = (album) => {
  selectedAlbum.value = album;
  MostrarConfirmacionEliminar.value = true;
};

const deleteAlbum = async () => {
  if (!selectedAlbum.value) return;
  try {
    const resultado = await eliminarAlbum(selectedAlbum.value.id);
    if (resultado) {
      MostrarConfirmacionEliminar.value = false;
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Álbum eliminado correctamente', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el álbum', life: 3000 });
    }
  } catch (err) {
    console.error('Error al eliminar el álbum:', err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el álbum', life: 3000 });
  }
};

const saveAlbumChanges = async () => {
  try {
    if (!selectedAlbum.value.nombre?.trim()) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Nombre requerido', life: 3000 });
      return;
    }
    

    const currentSongIds = albumCanciones.value.filter(s => !s.isNew).map(s => s.id);
    const deletedSongs = cancionesOriginales.value.filter(song => !currentSongIds.includes(song.id));

    for (const song of deletedSongs) {
      try {
        await eliminarCancion(song.id);
        console.log(`Canción ${song.nombre} eliminada correctamente`);
      } catch (error) {
        console.error(`Error al eliminar canción ${song.nombre}:`, error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: `Error al eliminar canción: ${song.nombre}`, 
          life: 3000 
        });
      }
    }

    const cancionesModificadas = albumCanciones.value.filter(s => !s.isNew && s.nombreModificado);
    for (const cancion of cancionesModificadas) {
      try {

        const response = await fetch(`/api/canciones/${cancion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            nombre: cancion.nombre,
            duracion: cancion.duracion,
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error al actualizar el nombre de la canción: ${cancion.nombre}`);
        }
        
        console.log(`Nombre de canción actualizado: ${cancion.nombre}`);
      } catch (error) {
        console.error(`Error al actualizar el nombre de la canción ${cancion.nombre}:`, error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: `Error al actualizar el nombre: ${cancion.nombre}`, 
          life: 3000 
        });
      }
    }

 
    const newSongIds = [];
    for (const song of CancionesPendientes.value) {
      try {
        const nuevaCancion = await agregarCancion(
          song, 
          selectedAlbum.value.id, 
          albumCanciones.value.findIndex(s => s.id === song.id) + 1
        );
        if (nuevaCancion) {
          newSongIds.push(nuevaCancion.id);
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: `Error al guardar canción: ${song.nombre}`, life: 3000 });
      }
    }
    

    let portadaUrl = null;
    if (imagenArchivo.value) {
      portadaUrl = await actualizarPortadaAlbum(selectedAlbum.value.id, imagenArchivo.value);
      if (!portadaUrl) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al subir la portada', life: 3000 });
      }
    }
    

    const songIds = [
      ...albumCanciones.value.filter(s => !s.isNew).map(s => s.id),
      ...newSongIds
    ];
    
    const albumData = {
      nombre: selectedAlbum.value.nombre,
      tipo: selectedAlbum.value.tipo || 'album',
      num_canciones: albumCanciones.value.length,
      duracion_total: calculateTotalDuration(),
      canciones: JSON.stringify(songIds)
    };

    const resultado = await actualizarAlbum(selectedAlbum.value.id, albumData);
    if (resultado) {
      await cargarAlbums();
      CancionesPendientes.value = [];
      MostrarPopupEditar.value = false;
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Álbum actualizado', life: 3000 });
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.value || 'Error al actualizar el álbum', 
        life: 3000 
      });
    }
  } catch (err) {
    console.error('Error:', err.response?.data);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: err.response?.data?.message || 'Error al guardar', 
      life: 3000 
    });
  }
};

const irACrearElAlbum = () => {
  router.push({ name: 'artista.upload' });
};

onMounted(() => {
  cargarAlbums();
});
</script>
<style scoped>

p {
  margin: 0 !important;
}

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

.contenido_edit {
  margin-left: 320px;
  margin-right: 20px;
  flex: 1;
  padding: 20px;
}

.titulo_albums {
  background: linear-gradient(to right, #F472B6, #A855F7);
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-size: 40px;
}

.color_texto {
  color: white;
}

/* Estilos generales */
.album_caja {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.albums_items {
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.album-items:hover {
  transform: scale(1.03);
}

.album_portada {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.album_portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.informacion_album {
  padding: 10px;
}

.nombre_album {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-overflow: ellipsis; 
}

.nombre_album_texto {
  color: #F472B6;
  width: 160px;
}

.detalle_album {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.tipo_album {
  text-transform: capitalize;
  background-color: rgba(168, 85, 247, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  color: white !important;
}

.album_Ncancion,
.duracion_album {
  display: flex;
  align-items: center;
  gap: 4px;
}

.album-actions {
  display: flex;
  gap: 8px;
}

.boton_editar,
.boton_borrar {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.boton_editar:hover,
.boton_borrar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.boton_editar {
  color: #A855F7;
}

.boton_borrar {
  color: #EF4444;
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
  
  .contenido_edit {
    margin-left: 0;
    margin-right: 0;
    margin-top: 20px;
    padding: 15px;
  }

}
</style>
<style>
/* Estilos para el Dialog */
.dialog_estilo {
  background-color: #200834 !important;
  border: 1px solid purple !important;
  color: white !important;
  max-width: 700px !important;
  width: 90% !important; 
}

.dialog_input {
  background-color: #200834 !important;
  border: 1px solid #A855F7 !important;
  color: white !important;
  margin-top: 30px;
}

.dialog_estilo label {
  margin-top: 20px;
  color: #F472B6 !important;
  background: transparent !important;
}

.dialog_estilo Button {
  background-color: #A855F7 !important;
  border: none !important;
  color: white !important;
}

.dialog_estilo .boton_cancelar {
  background-color: #4B5563 !important;
}

.dialog_estilo .boton_eliminar {
  background-color: #EF4444 !important;
}

.song-item .boton_eliminar {
  min-width: 2.5rem !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
}

.config_imagenes {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.imagen_config_perfil {
  position: relative;
  width: 230px;
  height: 230px;
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
/* Estilos para la sección de canciones */
.album-songs-section {
  margin-top: 20px;
  border-top: 1px solid rgba(138, 43, 226, 0.3);
  padding-top: 20px;
}

.songs-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #F472B6;
}

.songs-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 250px;
  overflow-y: auto;
}
.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-grow: 1;
}
.song-number {
  width: 25px;
  text-align: center;
  font-weight: bold;
}

.song-name {
  flex-grow: 1;
}

.song-duration,
.song-reproducciones {
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 5px;
}

.añadir_Canciones_Seccion {
  margin-top: 20px;
}

.add-songs-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Resumen del álbum */
.resumen_album {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
}

.resumen_caja {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.resumen_label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.7);
}

.valor_mucho {
  font-weight: bold;
}

.crear_album_boton {
  background-color: #A855F7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.crear_album_boton:hover {
  background-color: #9333EA;
}

.cargando,
.error,
.sin_albums {
  text-align: center;
  margin-top: 30px;
}

.sin_canciones {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 500px) {
  .song-item {
    padding: 8px 8px !important;
  }
  
  .song-info {
    gap: 8px !important;
    overflow: hidden !important;
  }
  
  .song-name {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 150px !important;
  }
  
  .imagen_config_perfil {
    width: 180px !important;
    height: 180px !important;
    margin: 0 auto !important;
  }

  
  .dialog_estilo .row {
    flex-direction: column !important;
  }
  
  .dialog_estilo .col-md-6 {
    width: 100% !important;
    margin-bottom: 15px !important;
  }
  
  .dialog_estilo .flex.justify-end {
    flex-wrap: nowrap !important;
  }
  .dialog_estilo .flex.justify-end button {
    flex: 1 !important;
    padding: 0.5rem !important;
    font-size: 0.9rem !important;
  }
}

.boton_eliminar .p-button-icon {
  font-size: 1rem !important;
}

.song-duration {
  display: flex !important;
  align-items: center !important;
  min-width: 70px !important;
  justify-content: flex-end !important;
}

.song-name-edit {
  flex: 1;
  padding: 0 8px;
}

.song-name-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  border: none !important;
  border-bottom: 1px solid rgba(168, 85, 247, 0.3) !important;
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 6px 8px !important;
  border-radius: 4px !important;
  margin: 0 !important;
}

.song-name-input:hover, .song-name-input:focus {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom: 1px solid #A855F7 !important;
  outline: none;
  box-shadow: none !important;
}


.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  gap: 12px;
}

.song-info {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 12px;
  overflow: hidden;
}

.song-number {
  min-width: 25px;
  text-align: center;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.song-duration {
  display: flex !important;
  align-items: center !important;
  min-width: 80px !important;
  justify-content: flex-end !important;
  margin-right: 8px; 
  color: rgba(255, 255, 255, 0.7);
}

.song-duration i {
  margin-right: 5px;
}

.song-actions {
  display: flex;
  justify-content: flex-end;
  min-width: 40px;
}


.song-item .boton_eliminar {
  min-width: 2.3rem !important;
  width: 2.3rem !important;
  height: 2.3rem !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  flex-shrink: 0 !important;
  background-color: rgba(239, 68, 68, 0.8) !important;
  transition: all 0.2s ease;
}

.song-item .boton_eliminar:hover {
  background-color: #EF4444 !important;
  transform: scale(1.05);
}


@media (max-width: a500px) {
  .song-name-input {
    font-size: 13px;
    padding: 4px 6px !important;
  }
  
  .song-info {
    gap: 6px !important;  
  }
  
  .song-duration {
    min-width: 65px !important;
    font-size: 12px;
  }
  
  .song-number {
    min-width: 20px;
  }
  
  .song-item {
    padding: 8px 6px !important;
  }
}

.dialog_input > * {
  color: white !important;
}
</style>
