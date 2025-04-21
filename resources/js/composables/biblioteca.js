import { ref } from "vue";
import axios from "axios";
import { authStore } from "@/store/auth.js";

export function datosBiblioteca() {
    const userPropio = authStore().user;
    const store = authStore(); 
    const listas = ref([]);
    const listasFavoritas = ref([]);
    const albumesFavoritos = ref([]);
    const PreviewImagenLista = ref(null);

    const listaData = ref({
        nombre: '',
        descripcion: '',
        portada: null,
        duracion_total: '00:00:00'
    });

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

    const resetFormulario = () => {
        listaData.value = {
            nombre: '',
            descripcion: '',
            portada: null,
            duracion_total: '00:00:00'
        };
        if (PreviewImagenLista.value) {
            URL.revokeObjectURL(PreviewImagenLista.value);
        }
        PreviewImagenLista.value = null;
    };

    const enviarFormulario = async () => {
        try {
            const listaFormData = new FormData();
            listaFormData.append('nombre', listaData.value.nombre);
            listaFormData.append('portada', listaData.value.portada);
            listaFormData.append('duracion_total', listaData.value.duracion_total);

            if (listaData.value.descripcion.trim() !== '') {
                listaFormData.append('descripcion', listaData.value.descripcion);
            }

            const response = await axios.post('/api/listas', listaFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Lista creada exitosamente', response.data);

            if (response.data.lista) {
                listas.value.push(response.data.lista);
            } else {
                console.error('Error: la respuesta no contiene la lista esperada.', response.data);
            }

            resetFormulario();
            return true;

        } catch (error) {
            console.error('Error:', error.response?.data);
            return false;
        }
    };

    return {
        listas,
        listasFavoritas,
        albumesFavoritos,
        listaData,
        PreviewImagenLista,
        getListasUsuario,
        getListasFavs,
        getAlbumesFavs,
        enviarFormulario,
        resetFormulario
    };
}
