import { ref, computed } from "vue";
import axios from "axios";
import { authStore } from "@/store/auth.js";



export function datosBiblioteca() {
    const userPropio = authStore().user;
    const store = authStore(); 
    const listas = ref([]);
    const listasFavoritas = ref([]);
    const albumesFavoritos = ref([]);

    

    const getListasUsuario = async () => {
        try {
            const response = await axios.get(`/api/listas/${userPropio.id}`);
            listas.value = response.data.data; 

        } catch (error) {
            console.error('Error encontrando listas:', error);
        }
    };

    const getListasFavs = async () => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return false;
        }
    
        try {
            const response = await axios.get(`/api/mostrar/lista/likes`);
            listasFavoritas.value = response.data.data;
        } catch (error) {
            console.error("Error al encontrar las listas favoritas", error);
            return false;
        }
    };

    const getAlbumesFavs = async () => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return false;
        }
    
        try {
            const response = await axios.get(`/api/mostrar/album/likes`);
            albumesFavoritos.value = response.data.data;
        } catch (error) {
            console.error("Error al encontrar los álbumes favoritos", error);
            return false;
        }
    };

    return {
        listas,
        getListasUsuario,
        listasFavoritas,
        getListasFavs,
        albumesFavoritos,
        getAlbumesFavs
    };
}
