import { ref, computed } from "vue";
import axios from "axios";

export function mostrarMusica(userId) {
    const populares = ref([]);
    const albumes = ref([]);

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

    return {
        populares,
        getPopulares,
        albumes,
        getAlbumesUser
    };
}