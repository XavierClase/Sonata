import { ref, computed, watch } from 'vue';
import axios from 'axios';

export function useBuscador() {
  const consultaBusqueda = ref('');
  const albumes = ref([]);
  const listasReproduccion = ref([]);
  const usuarios = ref([]);
  const cargando = ref(false);
  const mostrarResultados = ref(false);
  
  // Función para implementar el retraso en la búsqueda
  const busquedaRetrasada = usarRetraso(consultaBusqueda, 500);

  const hayResultados = computed(() => {
    return albumes.value.length > 0 || listasReproduccion.value.length > 0 || usuarios.value.length > 0;
  });

  // Observador para activar la búsqueda cuando el valor retrasado cambia
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
  
  // Función para manejar clics externos
  const manejarClicExterno = (evento) => {
    const contenedorBusqueda = document.querySelector('.contenedor-buscador');
    if (contenedorBusqueda && !contenedorBusqueda.contains(evento.target)) {
      mostrarResultados.value = false;
    }
  };

  // Función para retrasar los cambios en un valor
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
  
  return {
    consultaBusqueda,
    albumes,
    listasReproduccion,
    usuarios,
    cargando,
    mostrarResultados,
    hayResultados,
    alBuscar,
    limpiarResultados,
    realizarBusqueda,
    manejarClicExterno
  };
}