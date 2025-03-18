<template>
  <div class="grupo-entrada contenedor-buscador">
    <InputText 
      v-model="consultaBusqueda" 
      placeholder="Buscar álbumes, listas, usuarios..." 
      class="buscador" 
      @input="alBuscar" 
      @focus="mostrarResultados = true"
      @keydown.esc="mostrarResultados = false"
    />
   
    <!-- Resultados de búsqueda -->
    <div v-if="mostrarResultados && consultaBusqueda.length >= 3" class="contenedor-resultados">
      <div class="resultados-busqueda">
        <!-- Sección de álbumes -->
        <div class="seccion-resultado">
          <h3>Álbumes</h3>
          <div v-if="cargando" class="contenedor-carga">
            <ProgressSpinner style="width: 30px; height: 30px" />
          </div>
          <div v-else-if="albumes.length === 0" class="sin-resultados">
            No se encontraron álbumes
          </div>
          <ul v-else class="lista-resultados">
            <li v-for="album in albumes" :key="'album-'+album.id" @click="irAAlbum(album)">
              <div class="elemento-resultado">
                <img :src="album.portada" alt="Portada" class="imagen-resultado">
                <div class="info-resultado">
                  <span class="titulo-resultado">{{ album.nombre }}</span>
                  <span class="subtitulo-resultado">Álbum • {{ album.user?.name }}</span>
                  <span class="subtitulo-resultado">{{ album.tipo }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Sección de listas -->
        <div class="seccion-resultado">
          <h3>Listas</h3>
          <div v-if="cargando" class="contenedor-carga">
            <ProgressSpinner style="width: 30px; height: 30px" />
          </div>
          <div v-else-if="listasReproduccion.length === 0" class="sin-resultados">
            No se encontraron listas
          </div>
          <ul v-else class="lista-resultados">
            <li v-for="lista in listasReproduccion" :key="'list-'+lista.id" @click="irALista(lista)">
              <div class="elemento-resultado">
                <img :src="lista.portada" alt="Portada" class="imagen-resultado">
                <div class="info-resultado">
                  <span class="titulo-resultado">{{ lista.nombre }}</span>
                  <span class="subtitulo-resultado">Lista • {{ lista.canciones_count || 0 }} canciones</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- sección de usuarios  -->
        <div class="seccion-resultado">
          <h3>Usuarios</h3>
          <div v-if="cargando" class="contenedor-carga">
            <ProgressSpinner style="width: 30px; height: 30px" />
          </div>
          <div v-else-if="usuarios.length === 0" class="sin-resultados">
            No se encontraron usuarios
          </div>
          <ul v-else class="lista-resultados">
            <li v-for="usuario in usuarios" :key="'user-'+usuario.id" @click="irAUsuario(usuario)">
              <div class="elemento-resultado">
                <img :src="usuario.avatar" alt="Perfil" class="imagen-resultado imagen-usuario">
                <div class="info-resultado">
                  <span class="titulo-resultado">{{ usuario.name }}</span>
                  <span class="subtitulo-resultado">{{ usuario.rolNombre[0] }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import axios from 'axios';

const router = useRouter();
const consultaBusqueda = ref('');
const albumes = ref([]);
const listasReproduccion = ref([]);
const usuarios = ref([]);
const cargando = ref(false);
const mostrarResultados = ref(false);
const busquedaRetrasada = usarRetraso(consultaBusqueda, 500);

const manejarClicExterno = (evento) => {
  const contenedorBusqueda = document.querySelector('.contenedor-buscador');
  if (contenedorBusqueda && !contenedorBusqueda.contains(evento.target)) {
    mostrarResultados.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', manejarClicExterno);
});

onUnmounted(() => {
  document.removeEventListener('click', manejarClicExterno);
});

const hayResultados = computed(() => {
  return albumes.value.length > 0 || listasReproduccion.value.length > 0 || usuarios.value.length > 0;
});

watch(busquedaRetrasada, (nuevoValor) => {
  if (nuevoValor && nuevoValor.length >= 3) {
    realizarBusqueda(nuevoValor);
  } else {
    limpiarResultados();
  }
});

const limpiarResultados = () => {
  albumes.value = [];
  listasReproduccion.value = [];
  usuarios.value = [];
};

const alBuscar = () => {
  if (consultaBusqueda.value.length < 3) {
    limpiarResultados();
  }
};

const realizarBusqueda = async (consulta) => {
  if (!consulta || consulta.length < 3) return;
  
  cargando.value = true;
  limpiarResultados();
  
  try {
    const respuesta = await axios.get('/api/buscador', {
      params: { query: consulta }
    });
    
    albumes.value = respuesta.data.albums || [];
    listasReproduccion.value = respuesta.data.listaReproduccion || [];
    usuarios.value = respuesta.data.usuario || [];
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  } finally {
    cargando.value = false;
  }
};

const irAAlbum = (album) => {
  mostrarResultados.value = false;
  router.push({ name: 'app.album', params: { id: album.id } });
};

const irALista = (lista) => {
  mostrarResultados.value = false;
  router.push({ name: 'app.lista', params: { id: lista.id } });
};

const irAUsuario = (usuario) => {
  mostrarResultados.value = false;
  const primerRol = usuario?.roles?.[0]?.nombre?.toLowerCase() || 
                   usuario?.rolNombre?.[0]?.toLowerCase();
  const nombreRuta = primerRol === 'artista' ? 'artista.perfil' : 'app.perfil';
  router.push({
    name: nombreRuta,
    params: { id: usuario?.id || 0 }
  });
};

function usarRetraso(valor, retraso = 300) {
  const valorRetrasado = ref(valor.value);
  
  let temporizador;
  
  watch(valor, (nuevoValor) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      valorRetrasado.value = nuevoValor;
    }, retraso);
  });
  
  return valorRetrasado;
}
</script>

<style scoped>
.contenedor-buscador {
  position: relative;
}

.buscador {
  height: 4vh;
  width: 500px;
  background-color: #100E28;
  border-bottom: 1px solid #F472B6;
  border-right: 1px solid #F472B6;
  border-radius: 13px;
  color: rgb(255, 215, 215);
  background: url('images/lupa.svg')
      no-repeat 10px center;
      background-size: 25px;
      padding-left: 40px;
}

.buscador:focus {
  box-shadow: 0 0 0 1px #E289F2 !important;
  outline: none !important;
  border-color: transparent !important;
}

.contenedor-resultados {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 5px;
}

.resultados-busqueda {
  background-color: #1E1B4B;
  border: 1px solid #F472B6;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

.seccion-resultado {
  padding: 10px 0;
  border-bottom: 1px solid rgba(244, 114, 182, 0.3);
}

.seccion-resultado:last-child {
  border-bottom: none;
}

.seccion-resultado h3 {
  color: #F472B6;
  font-size: 1rem;
  margin: 0 0 10px 0;
  padding-left: 10px;
}

.lista-resultados {
  list-style: none;
  margin: 0;
  padding: 0;
}

.elemento-resultado {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.elemento-resultado:hover {
  background-color: rgba(244, 114, 182, 0.2);
}

.imagen-resultado {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
  border: 1px solid #F472B6;
}

.imagen-usuario {
  border-radius: 50%;
}

.info-resultado {
  display: flex;
  flex-direction: column;
}

.titulo-resultado {
  color: white;
  font-weight: 500;
}

.subtitulo-resultado {
  color: #CCC;
  font-size: 0.8rem;
}

.sin-resultados {
  color: #CCC;
  text-align: center;
  padding: 5px;
  font-size: 0.9rem;
}

.contenedor-carga {
  display: flex;
  justify-content: center;
}
</style>