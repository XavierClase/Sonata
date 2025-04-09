import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

export default function useListas() {
    const listas = ref({ data: [] });
    const lista = ref({});
    const errors = ref({});
    const loading = ref(false);
    const toast = useToast();

    const getListas = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/api/admin/listas');
            listas.value = response.data;
            loading.value = false;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar las listas de reproducción', 
                life: 3000
            });
        }
    };

    const getLista = async (id) => {
        loading.value = true;
        try {
            const response = await axios.get(`/api/admin/listas/${id}`);
            lista.value = response.data.data;
            loading.value = false;
            return lista.value;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar los detalles de la lista', 
                life: 3000
            });
            throw e;
        }
    };

    const storeLista = async (form) => {
        loading.value = true;
        errors.value = {};
        
        const formData = new FormData();
        for (const key in form) {
            if (key === 'portada' && form[key] instanceof File) {
                formData.append(key, form[key]);
            } else {
                formData.append(key, form[key]);
            }
        }

        try {
            const response = await axios.post('/api/admin/listas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            lista.value = response.data.lista;
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Lista de reproducción creada correctamente', 
                life: 3000
            });
            return response;
        } catch (e) {
            if (e.response && e.response.status === 422) {
                errors.value = e.response.data.errors;
            }
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al crear la lista de reproducción', 
                life: 3000
            });
            throw e;
        }
    };

    const updateLista = async (id, form) => {
        loading.value = true;
        errors.value = {};

        try {
            const response = await axios.put(`/api/admin/listas/${id}`, form);
            lista.value = response.data.data;
            loading.value = false;
            return response;
        } catch (e) {
            if (e.response && e.response.status === 422) {
                errors.value = e.response.data.errors;
            }
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al actualizar la lista de reproducción', 
                life: 3000
            });
            throw e;
        }
    };

    const deleteLista = async (id) => {
        loading.value = true;
        try {
            await axios.delete(`/api/admin/listas/${id}`);
            getListas(); 
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Lista de reproducción eliminada correctamente', 
                life: 3000
            });
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al eliminar la lista de reproducción', 
                life: 3000
            });
            throw e;
        }
    };

    const getCancionesLista = async (id) => {
        loading.value = true;
        try {
            const response = await axios.get(`/api/listas/${id}/canciones`);
            loading.value = false;
            return response.data.data;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar las canciones de la lista', 
                life: 3000
            });
            throw e;
        }
    };

    const eliminarCancionDeLista = async (listaId, cancionId) => {
        loading.value = true;
        try {
            await axios.delete(`/api/listas/${listaId}/cancion/${cancionId}`);
            loading.value = false;
            return true;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al eliminar la canción de la lista', 
                life: 3000
            });
            throw e;
        }
    };

    const updatePortada = async (id, file) => {
        loading.value = true;
        const formData = new FormData();
        formData.append('id', id);
        formData.append('picture', file);

        try {
            const response = await axios.post('/api/listas/updateimg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            loading.value = false;
            return response.data;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al actualizar la portada', 
                life: 3000
            });
            throw e;
        }
    };

    const añadirCancionALista = async (listaId, cancionId) => {
        loading.value = true;
        try {
            const response = await axios.post('/api/listas/añadirCancion', {
                lista_ids: [listaId],
                cancion_id: cancionId
            });
            loading.value = false;
            return response.data;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al añadir la canción a la lista',
                life: 3000
            });
            throw e;
        }
    };

    return {
        listas,
        lista,
        errors,
        loading,
        getListas,
        getLista,
        storeLista,
        updateLista,
        deleteLista,
        getCancionesLista,
        eliminarCancionDeLista,
        updatePortada,
        añadirCancionALista
    };
}