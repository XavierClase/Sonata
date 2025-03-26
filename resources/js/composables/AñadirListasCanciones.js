import { ref } from 'vue'
import axios from 'axios'

export function AñadirListasCanciones() {
  const loading = ref(false)
  const error = ref(null)
  const listas = ref([])
  const cancionesLista = ref([])


  const fetchListasUsuario = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/listas/usuario/${userId}`)
      listas.value = response.data.data
    } catch (err) {
      error.value = 'Error al cargar las listas'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

 
  const crearLista = async (datosLista) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      Object.keys(datosLista).forEach(key => {
        formData.append(key, datosLista[key])
      })

      const response = await axios.post('/api/listas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      listas.value.push(response.data.lista)
      return response.data.lista
    } catch (err) {
      error.value = 'Error al crear la lista'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  
  const fetchCancionesLista = async (listaId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/listas/${listaId}/canciones`)
      cancionesLista.value = response.data.data
    } catch (err) {
      error.value = 'Error al cargar las canciones de la lista'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  
  const añadirCancionALista = async (listaIds, cancionId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/listas/añadirCancion', {
        lista_ids: listaIds, 
        cancion_id: cancionId
      })
      return response.data 
    } catch (err) {
      error.value = 'Error al añadir canción a la lista'
      console.error(err)
      throw err 
    } finally {
      loading.value = false
    }
  }

  return {
    listas,
    cancionesLista,
    loading,
    error,
    fetchListasUsuario,
    crearLista,
    fetchCancionesLista,
    añadirCancionALista
  }
}