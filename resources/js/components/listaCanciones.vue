<template>

<Toast position="top-right" />
  <Dialog 
    v-model:visible="dialogVisible" 
    header="Añadir a Lista" 
    modal
    class="lista-canciones-dialog"
  >
  <div class="lista-canciones-container">
    <div class="crear-lista-y-busqueda">
      <div class="crear-lista">
        <Button 
          label="Crear Nueva Lista" 
          @click="mostrarModalCrearLista = true" 
          class="crear_album_boton"
        />
      </div>
      <div class="busqueda-listas">
        <InputText 
          v-model="filtro"
          placeholder="Buscar listas..."
          class="input-busqueda"
        />
        <i class="pi pi-search icono-busqueda"></i>
      </div>
    </div>

      <div v-if="loading" class="cargando">
        <p class="color_texto">Cargando listas...</p>
      </div>

      <div v-else-if="error" class="error">
        <p class="color_texto">{{ error }}</p>
      </div>

      <div v-else-if="listas.length === 0" class="sin_listas">
        <p class="color_texto">No tienes listas creadas aún.</p>
      </div>
      <div v-else-if="filtrarlistas.length === 0" class="sin_listas">
        <p class="color_texto">No se encontraron listas que coincidan con la búsqueda</p>
      </div>
      <div v-else class="listas_caja">
        <div 
        v-for="lista in filtrarlistas" 
          :key="lista.id" 
          class="listas_items"
          :class="{
            'lista-seleccionada': listasSeleccionadas.includes(lista.id),
            'lista-duplicada': cancionEnLista(lista.id)
          }"
          @click="toggleSeleccionLista(lista.id)"
        >

          <div class="lista_portada">
            <img 
              :src="conseguirImagenURL(lista)" 
              alt="Portada de la lista"
              class="imagen-portada"
            >
          </div>
          <div class="informacion_lista">
            <div class="nombre_lista">
              <p class="nombre_lista_texto">{{ lista.nombre }}</p>
            </div>
            <div class="detalle_lista">
              <p class="lista_Ncancion">
                <i class="pi pi-music"></i>
                {{ lista.num_canciones || 0 }} canciones
              </p>
              <p class="duracion_lista">
                <i class="pi pi-clock"></i>
                {{ formatoDuracionTotal(lista.duracion_total || '00:00') }}
              </p>
            </div>
          </div>
        </div>
        
      </div>


     
      <div class="añadir-cancion-seccion">
        <Button 
        label="Añadir a Listas Seleccionadas" 
        @click="agregarCancionAListas" 
        :disabled="listasSeleccionadas.length === 0"
        class="boton-añadir-cancion"
        />
      </div>

      <Dialog 
        v-model:visible="mostrarModalCrearLista" 
        header="Crear Nueva Lista" 
        modal
        class="modal-crear-lista"
      >
        <form @submit.prevent="crearNuevaLista">
          <div class="flex flex-column gap-3">
            <label for="nombre">Nombre de la Lista</label>
            <InputText 
              id="nombre" 
              v-model="nuevaLista.nombre" 
              required 
              class="input-dialog-listas-cancion"
            />
            
            <label for="descripcion">Descripción (opcional)</label>
            <Textarea 
              id="descripcion" 
              v-model="nuevaLista.descripcion" 
              rows="3" 
              class="input-dialog-listas-cancion"
            />
            
            <label for="portada">Portada de la Lista</label>
            
            <FileUpload 
              mode="basic" 
              name="portada" 
              url="./upload" 
              accept="image/*" 
              @select="onFileSelect"
              chooseLabel="Seleccionar imagen"
            />
            
            <Button type="submit" label="Crear" class="crear_album_boton" />
          </div>
        </form>
      </Dialog>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { AñadirListasCanciones } from '@/composables/AñadirListasCanciones.js'
import { authStore } from "@/store/auth.js";
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import { computed } from 'vue';
const toast = useToast();

const props = defineProps({
  cancion: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const userID = authStore().user.id; 
const filtro = ref('');
const { 
  listas, 
  loading, 
  error, 
  fetchListasUsuario, 
  crearLista,
  añadirCancionALista
} = AñadirListasCanciones()

const dialogVisible = ref(true)
const mostrarModalCrearLista = ref(false)
const listasSeleccionadas = ref([])

const nuevaLista = ref({
  nombre: '',
  descripcion: '',
  portada: null
})

const filtrarlistas = computed(() => {
  if (!filtro.value) return listas.value;
  
  return listas.value.filter(lista => 
    lista.nombre.toLowerCase().includes(filtro.value.toLowerCase())
  );
});

const conseguirImagenURL = (lista) => {
  let image = lista.portada;
  return new URL(image, import.meta.url).href;
}

const formatoDuracionTotal = (duracion) => {
  return duracion
}

const onFileSelect = (event) => {
  nuevaLista.value.portada = event.files[0]
}

const toggleSeleccionLista = (listaId) => {
  if (cancionEnLista(listaId)) {
    toast.add({
      severity: 'warn',
      summary: 'Canción duplicada',
      detail: 'Esta canción ya está en la lista',
      life: 3000,
      
    });
    return;
  }

  const index = listasSeleccionadas.value.indexOf(listaId);
  if (index > -1) {
    listasSeleccionadas.value.splice(index, 1);
  } else {
    listasSeleccionadas.value.push(listaId);
  }
};

const crearNuevaLista = async () => {
  try {
    const nuevaListaCreada = await crearLista({
      ...nuevaLista.value,
      duracion_total: '00:00:00'
    });
    
    if (nuevaListaCreada) {
      toast.add({
        severity: 'success',
        summary: 'Lista creada',
        detail: 'Tu lista se ha creado correctamente',
        life: 3000,
      
      });
      
      mostrarModalCrearLista.value = false;
      listasSeleccionadas.value.push(nuevaListaCreada.id);
      nuevaLista.value = { nombre: '', descripcion: '', portada: null }; 
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear la lista',
      life: 3000,
  
    });
  }
}

const agregarCancionAListas = async () => {
  if (props.cancion && listasSeleccionadas.value.length > 0) {
    try {
      const result = await añadirCancionALista(
        listasSeleccionadas.value,
        props.cancion.id
      );
      
      if (result.duplicados.length > 0) {
        toast.add({
          severity: 'warn',
          summary: 'Canciones duplicadas',
          detail: `La canción ya existe en ${result.duplicados.length} listas`,
          life: 5000,
      
        });
      }
      
      if (result.exitosas.length > 0) {
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Canción añadida a ${result.exitosas.length} listas`,
          life: 3000,
         
        });
      }
      
      dialogVisible.value = false;
      listasSeleccionadas.value = [];
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo añadir la canción',
        life: 3000,

      });
    }
  }
}

const cancionEnLista = (listaId) => {
  const lista = listas.value.find(l => l.id === listaId);
  return lista?.canciones?.some(c => c.id === props.cancion?.id);
};


onMounted(async () => {
  await fetchListasUsuario(userID)
})

watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('close')
  }
})
</script>

<style>
.lista-canciones-dialog {
  background-color: #200834 !important;
  border: 2px solid purple !important;
  width: 1000px !important;
  color: white !important;
}

.lista-canciones-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.listas_caja {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  max-height: 50vh;
  overflow-y: auto;
}

.listas_items {
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.2s, border 0.2s;
  border: 2px solid transparent;
}



.lista-seleccionada {
  border: 3px solid #c106ff;
  
}

.lista_portada {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.lista_portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.informacion_lista {
  padding: 10px;
}

.nombre_lista_texto {
  color: #F472B6;
  font-weight: bold;
}

.detalle_lista {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.crear_album_boton {
  background: linear-gradient(to right, #F472B6, #A855F7);
  color: white;
  border: none;
  transition: transform 0.2s;
}

.crear_album_boton:hover {
  transform: scale(1.05);
}

.boton-añadir-cancion {
  align-self: center;
  margin-top: 1rem;
  background: linear-gradient(to right, #F472B6, #A855F7);
  color: white;
  border: none;
}

.boton-añadir-cancion:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color_texto {
  color: white;
  text-align: center;
}


/* dialog para crear una lista */

.modal-crear-lista{
  background-color: #200834 !important;
  border: 2px solid purple !important;
  width: 700px !important;
  color: white !important;
}


.input-dialog-listas-cancion{

  padding: 12px;
  border: 1px solid #f472b5 !important;
  border-radius: 6px !important;
  background: transparent !important;
  color: #f472b5 !important;
  font-size: 16px !important;
}




.lista-duplicada {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}

.lista-duplicada::after {
  content: "Ya en la lista";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.crear-lista-y-busqueda {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.busqueda-listas {
  position: relative;
  width: 100%;
}

.input-busqueda {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid #F472B6 !important;
  border-radius: 25px !important;
  color: #F472B6 !important;
  transition: all 0.3s ease;
}

.input-busqueda::placeholder {
  color: #F472B6aa;
}

.icono-busqueda {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #F472B6;
  pointer-events: none;
}

.input-busqueda:focus {
  outline: none;
  box-shadow: 0 0 0 2px #F472B655;
}
</style>


