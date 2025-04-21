import { ref, computed } from "vue";
import axios from "axios";

export function mostrarMusica(idRemoto) {
    const populares = ref([]);
    const albumes = ref([]);
    const listas = ref([]);
    const listasGuardadas = ref([]);
    const album = ref(null);
    const canciones = ref(null);
    const lista = ref(null);

    const getPopulares = async () => {
        try {
            const response = await axios.get(`/api/canciones/populares/${idRemoto.value}`); 
            populares.value = response.data.data;  
        } catch (error) {
            console.error("Error al cargar las canciones populares", error);
        }
    };

    const getAlbumesUser = async () => {
        try {
            const response = await axios.get(`/api/albumes/${idRemoto.value}`); 
            albumes.value = response.data.data;  
        } catch (error) {
            console.error("Error al cargar los álbumes del usuario", error);
        }
    };

    const getAlbumData = async () => {
        try {
            const response = await axios.get(`/api/album/${idRemoto.value}`);
            album.value = response.data.data;
        } catch (error) {
            console.log("Error cargando los datos del álbum", error)
        }
    }

    const getCancionesAlbum = async () => {
        try {
            const response = await axios.get(`/api/albumes/${idRemoto.value}/canciones`);
            canciones.value = response.data.data;
        } catch (error) {
            console.log("Error al recuperar las canciones del álbum.")
        }
    }

    const getListasUser = async () => {
        try {
            const response = await axios.get(`/api/listas/${idRemoto.value}`);
            listas.value = response.data.data;
        } catch (error) {
            console.log("Error al cargar las listas del usuario", error)
        }
    }

    const getListasFavsUser = async () => {
        try {
            const response = await axios.get(`/api/mostrar/lista/likes/${idRemoto.value}`);
            listasGuardadas.value = response.data.data; 
        } catch (error) {
            console.log("Error al cargar las listas favoritas del usuario", error )
        }
    }

    const getListaData = async (listaId) => {
        try {
            const response = await axios.get(`/api/lista/${listaId}`);
            lista.value = response.data.data;
            return lista.value;
        } catch (error) {
            console.error('Error cargando datos de la lista:', error);
            throw error;
        }
    }

    const getCancionesLista = async (listaId) => {
        try {
            const response = await axios.get(`/api/listas/${listaId}/canciones`);
            canciones.value = response.data.data;
            return canciones.value;
        } catch (error) {
            console.error('Error cargando canciones de la lista:', error);
            throw error;
        }
    }

    const updateLista = async (listaId, datosLista) => {
        try {
            const response = await axios.post(`/api/listas/update/${listaId}`, datosLista);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la lista:", error);
            throw error;
        }
    }

    const updateListaImagen = async (listaId, formData) => {
        try {
            const response = await axios.post('/api/listas/updateimg', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la imagen de la lista:", error);
            throw error;
        }
    }

    const eliminarLista = async (listaId) => {
        try {
            const response = await axios.delete(`/api/listas/del/${listaId}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar la lista:", error);
            throw error;
        }
    }

    const eliminarCancionDeLista = async (listaId, cancionId) => {
        try {
            const response = await axios.delete(`/api/listas/${listaId}/cancion/${cancionId}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar la canción de la lista:", error);
            throw error;
        }
    }

    return {
        populares,
        getPopulares,
        albumes,
        getAlbumesUser,
        album,
        getAlbumData,
        canciones,
        getCancionesAlbum,
        listas,
        getListasUser,
        listasGuardadas,
        getListasFavsUser,
        lista,
        getListaData,
        getCancionesLista,
        updateLista,
        updateListaImagen,
        eliminarLista,
        eliminarCancionDeLista
    };
}