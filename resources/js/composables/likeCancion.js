import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { authStore } from "@/store/auth.js";

export function useLikes() {
    const favoritos = ref([]);

    const cargarFavoritos = async () => {
        try {
            const response = await axios.get(`/api/canciones/favoritos`);
            favoritos.value = response.data;
            console.log("Likes:", favoritos.value);
        } catch (error) {
            console.error("No se han podido cargar los likes del usuario", error.response?.data?.message || error.message);
        }
    };

    const likeCancion = async (idCancion) => {
        try {
            const orden = favoritos.value.length + 1;

            favoritos.value.push(idCancion);

            const response = await axios.post(`/api/like/cancion`, {
                id_cancion: idCancion,
                orden: orden
            });

            console.log(response.data.message);
        } catch (error) {
            console.error('Error al registrar el like:', error.response?.data?.message || error.message);
        }
    };

    const esFavorita = computed(() => (idCancion) =>
        favoritos.value.some((fav) => fav.id_cancion === idCancion)
    );

    onMounted(() => {
        cargarFavoritos();
    });

    return {
        likeCancion,
        esFavorita,
        cargarFavoritos
    };
}
