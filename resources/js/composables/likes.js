import { ref, computed } from "vue";
import axios from "axios";
import { authStore } from "@/store/auth.js";

export function useLikeCancion() {
    const store = authStore(); 
    const cancionesFaoritas = ref(new Set()); 

    const cargarFavoritosCanciones = async () => {
        if (!store.user) return;

        try {
            const response = await axios.get("/api/cancion/likes");
            cancionesFaoritas.value = new Set(response.data.favoritos); 
        } catch (error) {
            console.error("Error al cargar favoritos", error);
        }
    };

    const toggleLikeCancion = async (idCancion) => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return;
        }

        try {
            const response = await axios.post(`/api/like/cancion/${idCancion}`);
            cancionesFaoritas.value = new Set(response.data.favoritos); 
        } catch (error) {
            console.error("Error al dar/quitar like", error);
        }
    };

    const esFavoritaCancion = (idCancion) => cancionesFaoritas.value.has(idCancion);


    return {
        cancionesFaoritas,
        cargarFavoritosCanciones,
        toggleLikeCancion,
        esFavoritaCancion,
    };
}

export function useLikeAlbum() {
    const store = authStore(); 
    const favoritos = ref(new Set()); 

    

    const toggleLike = async (idAlbum) => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return;
        }

        try {
            const response = await axios.post(`/api/like/album/${idAlbum}`);
            favoritos.value = new Set(response.data.favoritos); 
        } catch (error) {
            console.error("Error al dar/quitar like", error);
        }
    };

    const esFavorito = async (idAlbum) => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return false;
        }
    
        try {
            const response = await axios.get(`/api/album/favorito/${idAlbum}`);
            console.log(response.data); // Verifica la respuesta
            return response.data.es_favorito; // Debería ser un booleano
        } catch (error) {
            console.error("Error al comprobar si el álbum es favorito", error);
            return false;
        }
    };
    


    return {
        favoritos,
        toggleLike,
        esFavorito
    };
}

export function useLikeLista() {
    const store = authStore(); 
    const favoritos = ref(new Set()); 

    

    const toggleLike = async (idLista) => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return;
        }

        try {
            const response = await axios.post(`/api/like/lista/${idLista}`);
            favoritos.value = new Set(response.data.favoritos); 
        } catch (error) {
            console.error("Error al dar/quitar like", error);
        }
    };

    const esFavorito = async (idLista) => {
        if (!store.user) {
            console.warn("El usuario no está autenticado");
            return false;
        }
    
        try {
            const response = await axios.get(`/api/lista/favorito/${idLista}`);
            console.log(response.data); // Verifica la respuesta
            return response.data.es_favorito; // Debería ser un booleano
        } catch (error) {
            console.error("Error al comprobar si el álbum es favorito", error);
            return false;
        }
    };
    


    return {
        favoritos,
        toggleLike,
        esFavorito
    };
}
