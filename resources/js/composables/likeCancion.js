import { ref } from "vue";
import axios from "axios";

export function useLikes() {
    // Creamos un array para almacenar las canciones que ya tienen "like" con su respectivo orden
    const likes = ref([]);

    const likeCancion = async (idCancion) => {
        try {
            // Calcular el orden en base a la longitud de likes (es decir, cuántas canciones ya tienen "like")
            const orden = likes.value.length + 1;

            // Añadir el "like" a nuestra lista local
            likes.value.push({ idCancion, orden });

            // Realizar la solicitud POST para registrar el like
            const response = await axios.post(`/api/like/cancion`, {
                id_cancion: idCancion,
                orden: orden
            });

            // Mostrar el mensaje de éxito
            console.log(response.data.message);

        } catch (error) {
            console.error('Error al registrar el like:', error.response ? error.response.data.message : error.message);
        }
    };

    return {
        likeCancion
    };
}
