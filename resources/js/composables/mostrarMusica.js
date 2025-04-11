import { ref, computed } from "vue";
import axios from "axios";

export function mostrarMusica(userId) {
    const populares = ref([]);
    const albumes = ref([]);
    const listas = ref([]);
    const listasGuardadas = ref([]);

    const getPopulares = async () => {
        try {
            const response = await axios.get(`/api/canciones/populares/${userId.value}`); 
            populares.value = response.data.data;  
        } catch (error) {
            console.error("Error al cargar las canciones populares", error);
        }
    };

    const getAlbumesUser = async () => {
        try {
            const response = await axios.get(`/api/albumes/${userId.value}`); 
            albumes.value = response.data.data;  
        } catch (error) {
            console.error("Error al cargar los álbumes del usuario", error);
        }
    };

    const getListasUser = async () => {
        try {
            const response = await axios.get(`/api/listas/${userId.value}`);
            listas.value = response.data.data;
        } catch (error) {
            console.log("Error al cargar las listas del usuario", error)
        }
    }

    const getListasFavsUser = async () => {
        try {
            const response = await axios.get(`/api/mostrar/lista/likes/${userId.value}`);
            listasGuardadas.value = response.data.data; 
        } catch (error) {
            console.log("Error al cargar las listas favoritas del usuario", error )
        }
    }

    return {
        populares,
        getPopulares,
        albumes,
        getAlbumesUser,
        listas,
        getListasUser,
        listasGuardadas,
        getListasFavsUser
    };
}